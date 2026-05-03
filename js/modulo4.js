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

// ===============================
// RECIBIR LIBRO DESDE MODULO 3
// ===============================
let libroSeleccionado = JSON.parse(localStorage.getItem("libroSeleccionado"));

if(libroSeleccionado){

    let yaExiste = reservas.find(r =>
        r.titulo === libroSeleccionado.titulo &&
        r.usuario === sesion.nombre
    );

    if(!yaExiste){
        reservas.push({
            idLibro: libroSeleccionado.titulo,
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
// MOSTRAR RESERVAS
// ===============================
function mostrarReservas(){

    let cont = document.getElementById("misReservas");
    cont.innerHTML = "";

    let mis = reservas.filter(r => r.usuario === sesion.nombre);

    if(mis.length === 0){
        cont.innerHTML = "<p>No tienes reservas</p>";
        return;
    }

    mis.forEach(r=>{
        cont.innerHTML += `
        <div class="card">
            📖 ${r.titulo} - En cola
        </div>
        `;
    });
}

// ===============================
// NOTIFICACIONES
// ===============================
function verificarDisponibilidad(){

    let cont = document.getElementById("notificaciones");
    cont.innerHTML = "";

    reservas.forEach((r,index)=>{

        let libro = libros.find(l => l.titulo === r.titulo);

        if(libro && libro.estado === "Disponible"){

            let primera = reservas.find(res => res.titulo === r.titulo);

            if(primera.usuario === sesion.nombre){

                cont.innerHTML += `
                <div>
                    🔔 ${r.titulo} disponible

                    <button onclick="tomarPrestado('${r.titulo}', ${index})">
                        Tomar ahora
                    </button>
                </div>
                `;
            }
        }
    });
}

// ===============================
// TOMAR PRÉSTAMO
// ===============================
function tomarPrestado(titulo, index){

    let libro = libros.find(l => l.titulo === titulo);

    if(libro){
        libro.estado = "Prestado";
    }

    reservas.splice(index,1);

    localStorage.setItem("libros", JSON.stringify(libros));
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("📚 Libro prestado");

    location.reload();
}

// ===============================
// INICIO
// ===============================
mostrarReservas();
verificarDisponibilidad();

setInterval(verificarDisponibilidad, 5000);

function volverPanel(){
    window.location.href = "panel.html";
}