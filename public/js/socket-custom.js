var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.get('nombre') || !params.get('sala')) {
    window.location = 'index.html';
    throw new Error('Falta pasar parametros nombre/sala');
};


let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {

    console.log('Se conecto con el servidor');

    socket.emit('entrarChat', usuario, function(data) {
        console.log(data);
    });
});

//emitir
//socket.emit('crearMensaje', {mensaje:'asdadsa'});


// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', function(resp) {
    console.log(resp);
});

socket.on('listaPersonas', function(resp) {
    console.log(resp);
});

//mensaje privado

socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
})