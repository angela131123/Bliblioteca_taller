// ===============================
// ARCHIVO: js/panel.js
// ===============================

// Verificar sesión
let sesion = JSON.parse(localStorage.getItem("sesionActiva"));

if (!sesion) {
    window.location.href = "login.html";
}

// Mostrar nombre usuario
document.getElementById("usuarioNombre").innerHTML =
    "👋 " + sesion.nombre;

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "login.html";
}