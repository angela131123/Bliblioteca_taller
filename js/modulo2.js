// ===============================
let libros = JSON.parse(localStorage.getItem("libros")) || [];
let editando = -1;

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    mostrarLibros();
    actualizarContador();
    cargarLibrosAPI(); // ← CARGAR API AQUÍ
});

// ===============================
function mostrarLibros(lista = libros) {
    let tabla = document.getElementById("tablaLibros");
    tabla.innerHTML = `
        <tr>
            <th>ID</th><th>Título</th><th>Autor</th><th>Categoría</th><th>Estado</th><th>Acciones</th>
        </tr>
    `;

    lista.forEach((l, i) => {
        tabla.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${l.titulo}</td>
                <td>${l.autor}</td>
                <td>${l.categoria}</td>
                <td><span style="color:${l.estado === 'Disponible' ? 'green' : 'red'}">${l.estado}</span></td>
                <td>
                    <button onclick="editar(${i})" class="btn-login" style="padding:5px 10px;font-size:12px;">Editar</button>
                    <button onclick="eliminarLibro(${i})" style="background:#dc3545;padding:5px 10px;font-size:12px;">Eliminar</button>
                    <button onclick="prestamoDirecto(${i})" class="btn-login" style="background:#28a745;
                    padding:5px 10px;font-size:12px;">Prestar</button>
                </td>
            </tr>
        `;
    });
}

// ===============================
function guardarLibro() {
    let titulo = document.getElementById("titulo").value.trim();
    let autor = document.getElementById("autor").value.trim();
    let categoria = document.getElementById("categoria").value.trim();

    if (!titulo || !autor || !categoria) {
        alert("❌ Complete todos los campos");
        return;
    }

    if (editando === -1) {
        libros.push({ titulo, autor, categoria, estado: "Disponible", portada: "" });
    } else {
        libros[editando] = { ...libros[editando], titulo, autor, categoria };
        editando = -1;
    }

    localStorage.setItem("libros", JSON.stringify(libros));
    limpiar();
    mostrarLibros();
    actualizarContador();
    alert("✅ Libro guardado correctamente");
}

// ===============================
function editar(i) {
    document.getElementById("titulo").value = libros[i].titulo;
    document.getElementById("autor").value = libros[i].autor;
    document.getElementById("categoria").value = libros[i].categoria;
    editando = i;
    document.getElementById("titulo").focus();
}

// ===============================
function eliminarLibro(i) {
    if (confirm("¿Eliminar este libro?")) {
        libros.splice(i, 1);
        localStorage.setItem("libros", JSON.stringify(libros));
        mostrarLibros();
        actualizarContador();
    }
}

// ===============================
function buscarLibro() {
    let texto = document.getElementById("buscar").value.toLowerCase().trim();
    let filtrado = libros.filter(l =>
        l.titulo.toLowerCase().includes(texto) ||
        l.autor.toLowerCase().includes(texto) ||
        l.categoria.toLowerCase().includes(texto)
    );
    mostrarLibros(filtrado);
}

// ===============================
function limpiar() {
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("categoria").value = "";
    editando = -1;
}

// ===============================
function actualizarContador() {
    document.getElementById("totalLibros").textContent = libros.length;
}

// ===============================
function volver() { window.location.href = "modulo1.html"; }
function irPrestamo() { window.location.href = "modulo3.html"; }

function prestamoDirecto(i) {
    localStorage.setItem("libroSeleccionado", JSON.stringify(libros[i]));
    window.location.href = "modulo3.html";
}

// ==========================================
// 🔥 API OPENLIBRARY 
// ==========================================
function cargarLibrosAPI() {
    const loading = document.getElementById("apiLoading");
    const apiLibros = document.getElementById("apiLibros");
    const apiError = document.getElementById("apiError");

    // Mostrar loading
    loading.style.display = "block";
    apiLibros.style.display = "none";
    apiError.style.display = "none";

    // Probar múltiples endpoints de OpenLibrary
    const urls = [
        "https://openlibrary.org/search.json?q=library&limit=24",
        "https://openlibrary.org/search.json?q=book&limit=24",
        "https://openlibrary.org/search.json?q=novel&limit=24"
    ];

    function intentarUrl(index) {
        if (index >= urls.length) {
            // Si todas fallan
            loading.style.display = "none";
            apiError.innerHTML = "❌ Error de conexión. Verifica tu internet.";
            apiError.style.display = "block";
            return;
        }

        fetch(urls[index])
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data.docs || data.docs.length === 0) throw new Error("Sin resultados");

                // ✅ ÉXITO - Mostrar libros
                loading.style.display = "none";
                apiLibros.style.display = "grid";
                apiLibros.innerHTML = "";

                data.docs.slice(0, 24).forEach((libro, idx) => {
                    let portada = libro.cover_i
                        ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
                        : `https://via.placeholder.com/180x260/eee/999?text=📚+Libro`;

                    let titulo = (libro.title || `Libro ${idx + 1}`).substring(0, 50);
                    let autor = libro.author_name?.[0] || "Autor desconocido";

                    // Escapar comillas correctamente
                    let tituloSafe = titulo.replace(/'/g, "\\'").replace(/"/g, '\\"');
                    let autorSafe = autor.replace(/'/g, "\\'").replace(/"/g, '\\"');

                    apiLibros.innerHTML += `
                        <div style="border:1px solid #eee;padding:15px;border-radius:10px;text-align:center;">
                            <img src="${portada}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;" 
                                 onerror="this.src='https://via.placeholder.com/180x260/eee/999?text=📚'">
                            <h4 style="margin:10px 0 5px 0;font-size:14px;">${titulo}</h4>
                            <p style="color:#666;margin:0;font-size:12px;">${autor}</p>
                            <button class="btn-login" style="width:100%;margin-top:10px;font-size:12px;"
                                    onclick="seleccionarYPrestar('${tituloSafe}', '${autorSafe}', 'API', '${portada}')">
                                🚀 Seleccionar y Prestar
                            </button>
                        </div>
                    `;
                });
            })
            .catch(error => {
                console.error(`URL ${index} falló:`, error);
                intentarUrl(index + 1); // Intentar siguiente URL
            });
    }

    intentarUrl(0); // Empezar con primera URL
}

// ===============================
function seleccionarYPrestar(titulo, autor, categoria, portada) {
    console.log("🎯 Seleccionando:", titulo, autor);
    
    let libroSeleccionado = {
        titulo: titulo.trim(),
        autor: autor.trim(),
        categoria: categoria || 'API',
        estado: "Disponible",
        portada: portada.trim()
    };

    // Guardar en libros si no existe
    let existe = libros.find(l => 
        l.titulo.toLowerCase() === titulo.toLowerCase() ||
        l.autor.toLowerCase() === autor.toLowerCase()
    );
    
    if (!existe) {
        libros.push(libroSeleccionado);
        localStorage.setItem("libros", JSON.stringify(libros));
    }

    // Redirigir
    localStorage.setItem("libroSeleccionado", JSON.stringify(libroSeleccionado));
    alert("✅ Libro seleccionado! Redirigiendo a préstamos...");
    window.location.href = "modulo3.html";
}