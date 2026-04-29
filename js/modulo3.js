// ==========================================
// PRÉSTAMOS + HISTORIAL
// ==========================================

let libros = JSON.parse(localStorage.getItem("libros")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// ==============================
// PESTAÑAS
// ==============================
function mostrarPrestamos() {
    document.getElementById('prestamos').classList.add('active');
    document.getElementById('historial').classList.remove('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
    cargarSelect();
    mostrarCatalogo();
}

function mostrarHistorial() {
    document.getElementById('historial').classList.add('active');
    document.getElementById('prestamos').classList.remove('active');
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    mostrarHistorialLibros();
}

// ==============================
// PRÉSTAMOS
// ==============================
function cargarSelect(){
    let select = document.getElementById("libroSelect");
    select.innerHTML = "";
    libros.forEach((l,i)=>{
        if(l.estado=="Disponible"){
            select.innerHTML += `<option value="${i}">${l.titulo}</option>`;
        }
    });
}

function mostrarCatalogo(){
    let cont = document.getElementById("catalogoPrestamo");
    cont.innerHTML = "";
    libros.forEach((l,i)=>{
        let portada = l.portada || "https://via.placeholder.com/150x220?text=Libro";
        cont.innerHTML += `
        <div class="card" style="text-align:center">
            <img src="${portada}" style="width:100%;height:240px;object-fit:cover;border-radius:10px;">
            <h4>${l.titulo}</h4>
            <p>${l.autor}</p>
            <p><b>${l.estado}</b></p>
        </div>
        `;
    });
}

function registrarPrestamo(){
    let usuario = document.getElementById("usuario").value;
    let indice = document.getElementById("libroSelect").value;
    let comentario = document.getElementById("comentario").value;
    
    if(usuario==""){ 
        alert("Ingrese usuario"); 
        return; 
    }
    
    libros[indice].estado = "Prestado";
    
    let registro = {
        usuario: usuario,
        titulo: libros[indice].titulo,
        autor: libros[indice].autor,
        portada: libros[indice].portada,
        comentario: comentario,
        fechaPrestamo: new Date().toLocaleDateString(),
        horaPrestamo: new Date().toLocaleTimeString(),
        estado: "Prestado"
    };
    
    historial.push(registro);
    
    localStorage.setItem("libros", JSON.stringify(libros));
    localStorage.setItem("historial", JSON.stringify(historial));
    
    document.getElementById("usuario").value = "";
    document.getElementById("comentario").value = "";
    
    cargarSelect();
    mostrarCatalogo();
    
    alert("✅ Préstamo registrado correctamente");
}

// ==============================
// HISTORIAL
// ==============================
function mostrarHistorialLibros(){
    let cont = document.getElementById("historialLibros");
    cont.innerHTML = "";
    
    if(historial.length == 0){
        cont.innerHTML = `<div class="card"><h3>No hay préstamos registrados</h3></div>`;
        return;
    }
    
    historial.slice().reverse().forEach((h,revIndex)=>{
        let i = historial.length - 1 - revIndex;
        let portada = h.portada || "https://via.placeholder.com/150x220?text=Libro";
        
        cont.innerHTML += `
        <div class="card" style="margin-bottom:25px;">
            <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;">
                <img src="${portada}" style="width:160px;height:230px;object-fit:cover;border-radius:12px;">
                <div style="flex:1;min-width:260px;">
                    <h2>${h.titulo}</h2>
                    <p><b>Usuario:</b> ${h.usuario}</p>
                    <p><b>Autor:</b> ${h.autor}</p>
                    <p><b>Fecha préstamo:</b> ${h.fechaPrestamo || h.fecha}</p>
                    <p><b>Hora préstamo:</b> ${h.horaPrestamo || "No registrada"}</p>
                    <p><b>Estado:</b> 
                        <span style="color:${h.estado=='Devuelto' ? 'green' : 'red'};font-weight:bold;">
                            ${h.estado}
                        </span>
                    </p>
                    ${h.estado=="Devuelto" ? 
                        `<p><b>Fecha devolución:</b> ${h.fechaDevolucion}</p>
                         <p><b>Hora devolución:</b> ${h.horaDevolucion}</p>` : ""}
                    <p><b>Comentario:</b> ${h.comentario || "Sin comentario"}</p>
                    ${h.estado!="Devuelto" ? 
                        `<button class="btn-login" onclick="devolver(${i})">Devolver Libro</button>` : 
                        `<button class="btn-login" disabled style="background:gray;">Devuelto ✓</button>`
                    }
                </div>
            </div>
        </div>
        `;
    });
}

function devolver(i){
    let hoy = new Date();
    let fecha = hoy.toLocaleDateString();
    let hora = hoy.toLocaleTimeString();
    let titulo = historial[i].titulo;
    
    // Actualizar historial
    historial[i].estado = "Devuelto";
    historial[i].fechaDevolucion = fecha;
    historial[i].horaDevolucion = hora;
    
    // Actualizar libro
    let libro = libros.find(l => l.titulo == titulo);
    if(libro) libro.estado = "Disponible";
    
    localStorage.setItem("historial", JSON.stringify(historial));
    localStorage.setItem("libros", JSON.stringify(libros));
    
    mostrarHistorialLibros();
    alert("✅ Libro devuelto correctamente");
}

function volver(){
    window.location.href = "modulo2.html";
}

// ==============================
// INICIALIZACIÓN
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    mostrarPrestamos();
});