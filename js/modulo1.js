// ===============================
// ARCHIVO: js/modulo1.js
// ===============================

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let editando = -1;

// Mostrar usuarios
function mostrarUsuarios(){

let tabla = document.getElementById("tablaUsuarios");

tabla.innerHTML = `
<tr>
<th>Nombre</th>
<th>Correo</th>
<th>Acciones</th>
</tr>
`;

usuarios.forEach((u,i)=>{

tabla.innerHTML += `
<tr>
<td>${u.nombre}</td>
<td>${u.correo}</td>
<td>
<button onclick="editar(${i})">Editar</button>
<button onclick="eliminarUsuario(${i})">Eliminar</button>
</td>
</tr>
`;

});

}

mostrarUsuarios();


// Guardar usuario
function guardarUsuario(){

let nombre = document.getElementById("nombre").value;
let correo = document.getElementById("correo").value;
let clave = document.getElementById("clave").value;

if(nombre=="" || correo=="" || clave==""){
mensaje("Complete campos","red");
return;
}

if(editando==-1){

usuarios.push({
nombre,
correo,
clave,
rol:"Usuario"
});

}else{

usuarios[editando].nombre = nombre;
usuarios[editando].correo = correo;
usuarios[editando].clave = clave;

editando = -1;
}

localStorage.setItem("usuarios",JSON.stringify(usuarios));

limpiar();
mostrarUsuarios();
mensaje("Guardado correctamente","green");

}


// Editar
function editar(i){

document.getElementById("nombre").value = usuarios[i].nombre;
document.getElementById("correo").value = usuarios[i].correo;
document.getElementById("clave").value = usuarios[i].clave;

editando = i;

}


// Eliminar
function eliminarUsuario(i){

if(confirm("¿Eliminar usuario?")){

usuarios.splice(i,1);

localStorage.setItem("usuarios",JSON.stringify(usuarios));

mostrarUsuarios();

}

}


// Mensaje
function mensaje(t,c){
let msg = document.getElementById("mensaje");
msg.innerHTML=t;
msg.style.color=c;
}

// Limpiar
function limpiar(){
document.getElementById("nombre").value="";
document.getElementById("correo").value="";
document.getElementById("clave").value="";
}

// Volver
function volver(){
window.location.href="panel.html";
}

// Ir módulo 2
function irModulo2(){
window.location.href="modulo2.html";
}


// API libros
fetch("https://openlibrary.org/search.json?q=library")
.then(res=>res.json())
.then(data=>{

let cont = document.getElementById("librosAPI");

data.docs.slice(0,8).forEach(libro=>{

let portada = libro.cover_i
? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
: "https://via.placeholder.com/150x220?text=Libro";

cont.innerHTML += `
<div class="card">
<img src="${portada}" width="100%" height="220">
<p>${libro.title}</p>
</div>
`;

});

});