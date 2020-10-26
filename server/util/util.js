const crearMensaje = (nombre, mensaje) => {
    return mensg = {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };
}


module.exports = {
    crearMensaje
}