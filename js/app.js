const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = JSON.parse(localStorage.getItem('arregloCitas')) || [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        this.sincronizarLocalStorage();
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.sincronizarLocalStorage();
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.sincronizarLocalStorage();
    }

    sincronizarLocalStorage() {
        localStorage.setItem('arregloCitas', JSON.stringify(this.citas));
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {

        const div = document.createElement('div');
        div.textContent = mensaje;
        div.classList.add('alert', 'text-center', 'col-12', 'd-block');

        if (tipo === 'error') {
            div.classList.add('alert-danger');
        } else {
            div.classList.add('alert-success');
        }

        document.querySelector('#contenido').insertBefore(div, document.querySelector('.agregar-cita'));
        setTimeout(() => {
            div.remove();
        }, 1500);
    }

    imprimirCitas({ citas }) {

        this.limpiarHTML();

        citas.forEach(cita => {

            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.textContent = mascota;
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');

            const propietarioParrafo = document.createElement('div');
            propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

            const telefonoParrafo = document.createElement('div');
            telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;

            const fechaParrafo = document.createElement('div');
            fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

            const horaParrafo = document.createElement('div');
            horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

            const sintomasParrafo = document.createElement('div');
            sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
      `;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`;
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>`;
            btnEditar.onclick = () => cargarEdicion(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

    comprobarCitas() {
        if (contenedorCitas.firstChild) {
            document.querySelector('#administra').textContent = 'Administra tus citas';
        } else {
            document.querySelector('#administra').textContent = 'No hay citas actualmente';
        }
    }
}

const administradorCitas = new Citas();
const ui = new UI();

eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', agregarCita);
    document.addEventListener('DOMContentLoaded', () => {
        ui.imprimirCitas(administradorCitas);
        ui.comprobarCitas();
    });
}

const citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function datosCita(e) {
    citasObj[e.target.name] = e.target.value;
}

function agregarCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citasObj;

    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son requeridos', 'error');
        return;
    }

    if (editando) {
        administradorCitas.editarCita({ ...citasObj });
        ui.imprimirAlerta('Editado correctamente');
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        editando = false;

    } else {
        citasObj.id = Date.now();
        administradorCitas.agregarCita({ ...citasObj });
        ui.imprimirAlerta('Se agregó correctamente');
    }

    formulario.reset();
    reiniciarObjeto();

    ui.imprimirCitas(administradorCitas);
    ui.comprobarCitas();
}

function reiniciarObjeto() {
    citasObj.mascota = '',
        citasObj.propietario = '',
        citasObj.telefono = '',
        citasObj.fecha = '',
        citasObj.hora = '',
        citasObj.sintomas = ''
}

function eliminarCita(id) {
    administradorCitas.eliminarCita(id);
    ui.imprimirAlerta('La cita se eliminó correctamente');
    ui.imprimirCitas(administradorCitas);
    ui.comprobarCitas();
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citasObj.mascota = mascota;
    citasObj.propietario = propietario;
    citasObj.telefono = telefono;
    citasObj.fecha = fecha;
    citasObj.hora = hora;
    citasObj.sintomas = sintomas;
    citasObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
};
