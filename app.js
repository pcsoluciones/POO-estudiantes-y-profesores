console.log("Funcionando...")

const formulario = document.querySelector("#formulario")
const cardsEstudiantes = document.querySelector("#cardsEstudiantes")
const cardsProfesores = document.querySelector("#cardsProfesores")
const templateEstudiante = document.querySelector("#templateEstudiante").content
const templateProfesor = document.querySelector("#templateProfesor").content
const alerta = document.querySelector(".alert")

const estudiantes = []
const profesores = []

class Persona {
    constructor(nombre, edad){
        this.nombre = nombre
        this.edad = edad
        this.uid = `${Date.now()}`              // para transformar a string
    }

    static pintarPersonaUI(personas, tipo){
        if (tipo === "Estudiante") {
            cardsEstudiantes.textContent = ""
            const fragment = document.createDocumentFragment()

            personas.forEach( (item) => {
                fragment.appendChild(item.agregarNuevoEstudiante())
            })

            cardsEstudiantes.appendChild(fragment)
        }

        if (tipo === "Profesor"){
            cardsProfesores.textContent = ""
            const fragment = document.createDocumentFragment()
            personas.forEach( (item) => {
                fragment.appendChild(item.agregarNuevoProfesor())
            })
            cardsProfesores.appendChild(fragment)
        }
    }
}

class Estudiante extends Persona {
    #estado = true
    #estudiante = "Estudiante"

    set setEstado(estado) {
        this.#estado = estado
    }

    get getEstudiante() {
        return this.#estudiante
    }

    agregarNuevoEstudiante() {
        const clone = templateEstudiante.cloneNode(true)
        clone.querySelector('h5 .text-primary').textContent = this.nombre
        clone.querySelector('h6').textContent = this.getEstudiante
        clone.querySelector('.lead').textContent = this.edad

        if (this.#estado) {
            clone.querySelector('.badge').className = "badge bg-success"
            clone.querySelector('.btn-success').disabled = true
            clone.querySelector('.btn-danger').disabled = false
        } else {
            clone.querySelector('.badge').className = "badge bg-danger"
            clone.querySelector('.btn-success').disabled = false
            clone.querySelector('.btn-danger').disabled = true
        }

        clone.querySelector('.badge').textContent = this.#estado ? "Aprobado" : "Reprobado"

        clone.querySelector(".btn-success").dataset.uid = this.uid
        clone.querySelector(".btn-danger").dataset.uid = this.uid

        return clone
    }
}


class Profesor extends Persona {
    #profesor = "Profesor"
    agregarNuevoProfesor() {
        const clone = templateProfesor.cloneNode(true)
        clone.querySelector('h5').textContent = this.nombre
        clone.querySelector('h6').textContent = this.#profesor
        clone.querySelector('.lead').textContent = this.edad
        return clone
    }

}


document.addEventListener("click", e => {
    //console.log(e.target.dataset.nombre)
    if (e.target.dataset.uid) {
        //console.log(e.target.matches(".btn-success"))
        if (e.target.matches(".btn-success")) {     // si boton esta activado  true
            estudiantes.map(item => {               // recorre y busca
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = true
                }
                return item
            })
        }
        if (e.target.matches(".btn-danger")) {     // si boton esta activado  true
            estudiantes.map(item => {               // recorre y busca
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = false
                }
                return item
            })
        }
        Persona.pintarPersonaUI(estudiantes, "Estudiante")
    }
})


formulario.addEventListener('submit', e => {
    e.preventDefault()

    const datos = new FormData(formulario)
    //console.log(datos)
    //datos.forEach((item) => console.log(item))
    //console.log( [...datos.values()])
    const [nombre, edad, opcion] = [...datos.values()]
    //console.log(nombre, edad, opcion)

    // validación de datos
    alerta.classList.add("d-none")
    if ( !nombre.trim() || !edad.trim() || !opcion.trim() ){
        console.log('datos en blanco')
        alerta.classList.remove('d-none')
        return
    }






    if (opcion === "Estudiante") {
        const estudiante = new Estudiante(nombre,edad)
        estudiantes.push(estudiante)
        Persona.pintarPersonaUI(estudiantes, opcion)
    }

    if (opcion === "Profesor") {
        const profesor = new Profesor(nombre, edad)
        profesores.push(profesor)
        Persona.pintarPersonaUI(profesores, opcion)
    }

    formulario.nombre.value = ""
    formulario.edad.value = ""
    formulario.opcion.value = "Estudiante"
})