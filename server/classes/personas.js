class Personas {

    constructor() {
        this.personas = [];
    }


    agregarPersonas(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;

    }

    getPersona(id) {
        let persona = this.personas.filter(pers => pers.id === id)[0];
        return persona;
    }


    getPeronas() {
        return this.personas;
    }

    getPeronasSala(sala) {
        let personasSala = this.personas.filter(pers => sala === pers.sala);

        return personasSala;
    }


    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(pers => pers.id !== id);

        return personaBorrada;
    }

}

module.exports = {
    Personas
}