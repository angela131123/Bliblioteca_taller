// ===============================
// ARCHIVO: js/login.js
// ===============================

// Crear administrador inicial
function crearAdmin() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.find(u => u.correo === "administrador@gmail.com");

    if (!existe) {
        usuarios.push({
            nombre: "AdministradorPrincipal",
            correo: "administrador@gmail.com",
            clave: "123456789",
            rol: "Administrador"
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

crearAdmin();


// Mostrar login
function mostrarLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registroForm").style.display = "none";

    document.querySelectorAll(".tab")[0].classList.add("active");
    document.querySelectorAll(".tab")[1].classList.remove("active");

    limpiarMensaje();
}

// Mostrar registro
function mostrarRegistro() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registroForm").style.display = "block";

    document.querySelectorAll(".tab")[1].classList.add("active");
    document.querySelectorAll(".tab")[0].classList.remove("active");

    limpiarMensaje();
}


// Registrar usuario
function registrarUsuario() {

    let nombre = document.getElementById("nombreRegistro").value.trim();
    let correo = document.getElementById("correoRegistro").value.trim();
    let clave = document.getElementById("claveRegistro").value.trim();

    if (nombre === "" || correo === "" || clave === "") {
        mensaje("Complete todos los campos", "red");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.find(u => u.correo === correo);

    if (existe) {
        mensaje("Ese correo ya está registrado", "red");
        return;
    }

    usuarios.push({
        nombre,
        correo,
        clave,
        rol: "Usuario"
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensaje("Registro exitoso ✅", "green");

    setTimeout(() => {
        mostrarLogin();
    }, 1200);
}


// Iniciar sesión
function iniciarSesion() {

    let correo = document.getElementById("correoLogin").value.trim();
    let clave = document.getElementById("claveLogin").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuario = usuarios.find(
        u => u.correo === correo && u.clave === clave
    );

    if (!usuario) {
        mensaje("Correo o contraseña incorrectos", "red");
        return;
    }

    localStorage.setItem("sesionActiva", JSON.stringify(usuario));

    mensaje("Bienvenido " + usuario.nombre, "green");

    setTimeout(() => {
        window.location.href = "panel.html";
    }, 1000);
}


// Mensaje
function mensaje(texto, color) {
    let msg = document.getElementById("mensaje");
    msg.innerHTML = texto;
    msg.style.color = color;
}

// Limpiar
function limpiarMensaje() {
    document.getElementById("mensaje").innerHTML = "";
}

// ==========================================
// CARRUSEL DE LIBROS EN INDEX.HTML
// ==========================================

// Solo ejecutar si existe slider
if (document.getElementById('slider')) {

    const librosCarrusel = [
        {
            img: "https://covers.openlibrary.org/b/id/10364748-L.jpg",
            titulo: "Harry Potter",
            autor: "J.K. Rowling"
        },
        {
            img: "https://covers.openlibrary.org/b/id/8234430-L.jpg",
            titulo: "El Principito",
            autor: "Antoine de Saint-Exupéry"
        },
        {
            img: "https://covers.openlibrary.org/b/id/8634471-L.jpg",
            titulo: "Cien Años de Soledad",
            autor: "Gabriel García Márquez"
        },
        {
            img: "https://covers.openlibrary.org/b/id/10485722-L.jpg",
            titulo: "El Alquimista",
            autor: "Paulo Coelho"
        }
    ];

    let slideActual = 0;
    let autoSlide;

    // ==========================
    // BOTONES
    // ==========================
    window.cambiarSlide = function(direccion) {
        slideActual += direccion;

        if (slideActual >= librosCarrusel.length) slideActual = 0;
        if (slideActual < 0) slideActual = librosCarrusel.length - 1;

        actualizarSlider();
    };

    window.irASlide = function(indice) {
        slideActual = indice;
        actualizarSlider();
        reiniciarAutoSlide();
    };

    // ==========================
    // INICIALIZAR
    // ==========================
    function initCarrusel() {

        const slider = document.getElementById('slider');
        const dotsContainer = document.getElementById('sliderDots');

        slider.innerHTML = librosCarrusel.map(libro => `
            <div class="slide">
                <img src="${libro.img}">
                <h3>${libro.titulo}</h3>
                <p>${libro.autor}</p>
            </div>
        `).join('');

        dotsContainer.innerHTML = librosCarrusel.map((_, i) => `
            <span class="dot ${i === 0 ? 'active' : ''}" onclick="irASlide(${i})"></span>
        `).join('');

        reiniciarAutoSlide();
    }

    // ==========================
    // ACTUALIZAR
    // ==========================
    function actualizarSlider() {
        const slider = document.getElementById('slider');
        slider.style.transform = `translateX(-${slideActual * 100}%)`;

        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === slideActual);
        });
    }

    // ==========================
    // AUTO PLAY
    // ==========================
    function reiniciarAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(() => cambiarSlide(1), 4000);
    }

}
    // Inicializar
    document.addEventListener('DOMContentLoaded', initCarrusel);
    
    const carrusel = document.querySelector('.hero-carrusel');
    carrusel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carrusel.addEventListener('mouseleave', reiniciarAutoSlide);
