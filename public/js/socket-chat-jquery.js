//Funciones renderizar usuarios
let params_jquery = new URLSearchParams(window.location.search);

//referencias de jquery
let divUsuarios = $('#divUsuarios');
let textForm = $('#textForm');
let textMensaje = $('#textMensaje');
let divChatbox = $('#divChatbox');
let tituloSmall = $('#tituloSmall')
let buscarUsuario = $('#buscarUsuario');
let nombre = params_jquery.get('nombre');
let sala = params_jquery.get('sala');

//Titulo Sala
tituloSmall.html(sala);


function renderizarUsuarios(usuarios) {

    let html = '';

    html += '<li>';
    html += `<a href="javascript:void(0)" class="active"> Chat de <span> ${params_jquery.get('sala')}</span></a>`;
    html += '</li>';

    for (let i = 0; i < usuarios.length; i++) {
        html += '<li>'
        html += `<a data-id="${usuarios[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${usuarios[i].nombre} <small class="text-success">online</small></span></a>`;
        html += '</li>';
    }

    //Asigno al div que conitiene el listado de los delos uusarios conectados
    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {

    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();
    let color = 'info';

    if (mensaje.nombre === 'Administrador') {
        color = 'danger';
    }

    if (yo) {
        html += '<li class="reverse animated fadeIn">';
        html += '<div class="chat-content">';
        html += `<h5>${mensaje.nombre}</h5>`;
        html += `<div class="box bg-light-inverse">${mensaje.mensaje}</div>`;
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += `<div class="chat-time">${hora}</div>`;
        html += '</li>';

    } else {
        html += '<li class="animated fadeIn">'
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += `<h5>${mensaje.nombre}</h5>`;
        html += `<div class="box bg-light-${color}">${mensaje.mensaje}</div>`;
        html += '</div>';
        html += `<div class="chat-time">${hora}</div>`;
        html += ' </li>';
    }

    divChatbox.append(html);

}


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsuarios.on('click', 'a', function() {

    let id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

textForm.on('submit', function(e) {

    e.preventDefault();

    if (textMensaje.val().trim().length === 0) {
        return;
    }

    //Enviar Mensaje
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: textMensaje.val()
    }, function(resp) {
        renderizarMensajes(resp, true);
        scrollBottom();
        textMensaje.val('').focus();
    });

});


buscarUsuario.on('keyup', function() {

    let cadena = buscarUsuario.val().toLowerCase();
    let usuariosEntonctrado = [];

    socket.emit('buscarUsuarios', sala, function(resp) {

        resp.forEach(user => {
            let nombre = user.nombre.toLowerCase();
            if (nombre.indexOf(cadena) !== -1) {
                usuariosEntonctrado.push(user);
            }
        });

        if (usuariosEntonctrado.length === 0) {
            renderizarUsuarios(resp);
            return;
        }
        renderizarUsuarios(usuariosEntonctrado);
    });


});