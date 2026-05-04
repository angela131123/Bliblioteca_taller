// ===============================
// SESIÓN
// ===============================
let sesion = JSON.parse(localStorage.getItem("sesionActiva"));

if (!sesion) {
    window.location.href = "login.html";
}

// ===============================
// DATOS
// ===============================
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let libros = JSON.parse(localStorage.getItem("libros")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// ===============================
// RECIBIR LIBRO DESDE MODULO 3
// ===============================
let libroSeleccionado = JSON.parse(localStorage.getItem("libroSeleccionado"));

if (libroSeleccionado) {

    let yaExiste = reservas.find(r =>
        r.titulo === libroSeleccionado.titulo &&
        r.usuario === sesion.nombre
    );

    if (!yaExiste) {
        reservas.push({
            titulo: libroSeleccionado.titulo,
            usuario: sesion.nombre,
            fecha: new Date().toLocaleString()
        });

        localStorage.setItem("reservas", JSON.stringify(reservas));
        alert("📌 Libro reservado automáticamente");
    }

    localStorage.removeItem("libroSeleccionado");
}

// ===============================
// PORTADA (OpenLibrary)
// ===============================
function obtenerPortada(titulo) {
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(titulo)}-M.jpg`;
}

// ===============================
// QUIÉN TIENE EL LIBRO
// ===============================
function obtenerPrestamoActivo(titulo) {
    return historial.find(h => h.titulo === titulo && h.estado === "Prestado");
}

// ===============================
// MOSTRAR RESERVAS CON COLA
// ===============================
function mostrarReservas() {

    let cont = document.getElementById("misReservas");
    cont.innerHTML = "";

    let mis = reservas.filter(r => r.usuario === sesion.nombre);

    if (mis.length === 0) {
        cont.innerHTML = "<p>No tienes reservas</p>";
        return;
    }

    mis.forEach(r => {

        let portada = obtenerPortada(r.titulo);
        let prestamo = obtenerPrestamoActivo(r.titulo);

        // 🔥 COLA DEL LIBRO
        let colaLibro = reservas.filter(res => res.titulo === r.titulo);

        // 🔥 POSICIÓN
        let posicion = colaLibro.findIndex(res =>
            res.usuario === sesion.nombre && res.fecha === r.fecha
        ) + 1;

        cont.innerHTML += `
        <div class="card-libro">

            <img src="${portada}" 
                 onerror="this.src='https://via.placeholder.com/150x220?text=Libro'">

            <h3>${r.titulo}</h3>

            <p class="cola">📍 Posición en cola: <b>${posicion}</b></p>
            <p>Total en espera: ${colaLibro.length}</p>

            ${prestamo ? `
                <p><b>Prestado a:</b> ${prestamo.usuario}</p>
                <p><b>Comentario:</b> ${prestamo.comentario || "Sin comentario"}</p>
            ` : `
                <p class="ok">Disponible pronto</p>
            `}

            <p class="fecha">Reservado: ${r.fecha}</p>

        </div>
        `;
    });
}

// ===============================
// NOTIFICACIONES (SOLO PRIMERO)
// ===============================
function verificarDisponibilidad() {

    let cont = document.getElementById("notificaciones");
    cont.innerHTML = "";

    let librosUnicos = [...new Set(reservas.map(r => r.titulo))];

    librosUnicos.forEach(titulo => {

        let libro = libros.find(l => l.titulo === titulo);
        let cola = reservas.filter(r => r.titulo === titulo);

        if (libro && libro.estado === "Disponible" && cola.length > 0) {

            let primero = cola[0];

            if (primero.usuario === sesion.nombre) {

                cont.innerHTML += `
                <div class="notificacion">
                    🔔 <b>${titulo}</b> está disponible

                    <button onclick="tomarPrestado('${titulo}')">
                        Tomar ahora
                    </button>
                </div>
                `;
            }
        }
    });
}

// ===============================
// TOMAR PRÉSTAMO (SOLO PRIMERO)
// ===============================
function tomarPrestado(titulo) {

    let libro = libros.find(l => l.titulo === titulo);

    if (libro) {
        libro.estado = "Prestado";
    }

    // eliminar primero de la cola
    let index = reservas.findIndex(r => r.titulo === titulo);
    if (index !== -1) reservas.splice(index, 1);

    localStorage.setItem("libros", JSON.stringify(libros));
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("📚 Libro prestado");
    location.reload();
}

// ===============================
// VOLVER
// ===============================
function volverPanel() {
    window.location.href = "panel.html";
}

// ===============================
// INICIO
// ===============================
mostrarReservas();
verificarDisponibilidad();
setInterval(verificarDisponibilidad, 5000);