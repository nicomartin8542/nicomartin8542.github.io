const { io } = require('../server');

const { Personas } = require('../classes/personas');

const { crearMensaje } = require('../util/util');

let personasChat = new Personas();

io.on('connection', (client) => {

    console.log('Se conecto con el servidor');

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            callback({
                error: 'ok',
                mensaje: 'Falta pasar nombre/sala como parametro'
            });
        }

        client.join(data.sala);

        let personas = personasChat.agregarPersonas(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', personasChat.getPeronasSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se conecto`));
        callback(personasChat.getPeronasSala(data.sala));

    });

    client.on('crearMensaje', (data, callback) => {

        let persona = personasChat.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('mensajePrivado', (data) => {

        let persona = personasChat.getPersona(client.id);

        client.broadcast.to(data.id).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

    client.on('buscarUsuarios', (data, callback) => {

        let personas = personasChat.getPeronasSala(data);

        callback(personas);

    });

    client.on('disconnect', () => {
        let personaborrada = personasChat.borrarPersona(client.id);
        let sala = personaborrada.sala;
        client.broadcast.to(sala).emit('crearMensaje', crearMensaje('Administrador', `${personaborrada.nombre} salio`));
        client.broadcast.to(sala).emit('listaPersona', personasChat.getPeronasSala(sala));
    });

});