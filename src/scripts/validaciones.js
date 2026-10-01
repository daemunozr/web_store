/*
 * Validaciones de formularios (RF-01, RF-08, RF-10, RF-11, RNF-02).
 *
 * Todos los formularios del sistema se validan en el cliente mientras el
 * usuario escribe, antes de permitir el envio, con mensajes propios junto a
 * cada campo. La sugerencia del formato esperado (RUN, dominios de correo,
 * largo de la contrasena) se escribe en el HTML como .form-text y es distinta
 * del mensaje de error, que aparece solo al infringir la regla (RNF-02 CA5).
 */

// Unicos dominios de correo aceptados por el sistema (ver 1.3 del ERS).
const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* ------------------------------------------------------------------- RUN */
/** Digito verificador de un RUN chileno por el metodo del modulo 11. */
function digitoVerificador(cuerpo) {
	let suma = 0;
	let factor = 2;

	for (const caracter of [...String(cuerpo)].reverse()) {
		suma += Number(caracter) * factor;
		factor = factor === 7 ? 2 : factor + 1;
	}

	const resto = 11 - (suma % 11);
	if (resto === 11) return "0";
	if (resto === 10) return "K";
	return String(resto);
}

/** Valida un RUN sin puntos ni guion, de 7 a 9 caracteres (RF-01 CA2). */
function runValido(valor) {
	const run = String(valor).trim().toUpperCase();
	if (!/^[0-9]{6,8}[0-9K]$/.test(run)) return false;
	const cuerpo = run.slice(0, -1);
	return digitoVerificador(cuerpo) === run.slice(-1);
}

/* ---------------------------------------------------------------- Reglas
   Cada regla recibe el valor y devuelve "" si pasa o el mensaje de error. */
const reglas = {
	requerido: (mensaje = "Este campo es obligatorio.") => (valor) =>
		String(valor).trim() === "" ? mensaje : "",

	maximo: (largo) => (valor) =>
		String(valor).length > largo ? `No puede superar los ${largo} caracteres.` : "",

	minimo: (largo) => (valor) =>
		String(valor).trim() !== "" && String(valor).trim().length < largo
			? `Debe tener al menos ${largo} caracteres.`
			: "",

	run: () => (valor) =>
		String(valor).trim() === "" || runValido(valor)
			? ""
			: "RUN invalido: escribelo sin puntos ni guion y revisa el digito verificador.",

	correo: () => (valor) => {
		const correo = String(valor).trim().toLowerCase();
		if (correo === "") return "";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return "Escribe un correo valido.";
		return DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio))
			? ""
			: `Solo se aceptan los dominios ${DOMINIOS_PERMITIDOS.join(", ")}.`;
	},

	contrasena: () => (valor) => {
		const clave = String(valor);
		if (clave === "") return "";
		return clave.length < 4 || clave.length > 10
			? "La contrasena debe tener entre 4 y 10 caracteres."
			: "";
	},

	numeroMinimo: (minimo) => (valor) => {
		if (String(valor).trim() === "") return "";
		const numero = Number(valor);
		if (Number.isNaN(numero)) return "Debe ser un numero.";
		return numero < minimo ? `No puede ser menor que ${minimo}.` : "";
	},

	entero: () => (valor) => {
		if (String(valor).trim() === "") return "";
		const numero = Number(valor);
		if (Number.isNaN(numero)) return "Debe ser un numero.";
		return Number.isInteger(numero) ? "" : "Debe ser un numero entero, sin decimales.";
	},

	seleccion: (mensaje = "Selecciona una opcion.") => (valor) => (valor === "" ? mensaje : ""),
};

/* ---------------------------------------------- Pintado del estado del campo */
/** Devuelve (creandolo si falta) el contenedor del mensaje de error del campo. */
function cajaDeError(campo) {
	let caja = campo.parentElement.querySelector(`.invalid-feedback[data-de="${campo.id}"]`);
	if (!caja) {
		caja = document.createElement("p");
		caja.className = "invalid-feedback";
		caja.dataset.de = campo.id;
		campo.insertAdjacentElement("afterend", caja);
	}
	return caja;
}

/** Valida un campo y pinta su estado. Devuelve true si pasa todas sus reglas. */
function validarCampo(campo, listaDeReglas) {
	const error = listaDeReglas.map((regla) => regla(campo.value, campo)).find((mensaje) => mensaje) ?? "";
	const caja = cajaDeError(campo);

	caja.textContent = error;
	campo.classList.toggle("is-invalid", Boolean(error));
	campo.classList.toggle("is-valid", !error && String(campo.value).trim() !== "");
	campo.setAttribute("aria-invalid", error ? "true" : "false");

	return !error;
}

/** Limpia los estados de validacion del formulario (tras un envio correcto). */
function limpiarEstados(formulario) {
	formulario.querySelectorAll(".is-invalid, .is-valid").forEach((campo) => {
		campo.classList.remove("is-invalid", "is-valid");
		campo.removeAttribute("aria-invalid");
	});
	formulario.querySelectorAll(".invalid-feedback").forEach((caja) => {
		caja.textContent = "";
	});
}

/**
 * Conecta un formulario con su definicion de reglas.
 * definicion: { idDelCampo: [regla, ...] }
 * alEnviar: funcion que recibe los datos cuando todo el formulario es valido.
 */
function configurar(formulario, definicion, alEnviar) {
	formulario.setAttribute("novalidate", "");

	const campos = Object.entries(definicion)
		.map(([id, listaDeReglas]) => ({ campo: formulario.querySelector(`#${id}`), listaDeReglas }))
		.filter(({ campo }) => campo);

	campos.forEach(({ campo, listaDeReglas }) => {
		const evento = campo.tagName === "SELECT" || campo.type === "date" ? "change" : "input";
		campo.addEventListener(evento, () => validarCampo(campo, listaDeReglas));
		campo.addEventListener("blur", () => validarCampo(campo, listaDeReglas));
	});

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();

		const valido = campos
			.map(({ campo, listaDeReglas }) => validarCampo(campo, listaDeReglas))
			.every(Boolean);

		if (!valido) {
			formulario.querySelector(".is-invalid")?.focus();
			return;
		}

		const datos = Object.fromEntries(
			[...new FormData(formulario).entries()].map(([clave, valor]) => [clave, String(valor).trim()]),
		);
		alEnviar(datos, formulario);
	});

	return { validar: () => campos.every(({ campo, listaDeReglas }) => validarCampo(campo, listaDeReglas)) };
}

/* ------------------------------------------------------------- Utilidades */
/** Muestra un aviso (exito o error) en el contenedor indicado. */
function aviso(contenedor, mensaje, tipo = "success") {
	if (!contenedor) return;
	contenedor.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensaje}</div>`;
	contenedor.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Llena el select de regiones y recarga el de comunas cada vez que cambia,
 * dejando solo las comunas de la region escogida (RF-01 CA5).
 */
function conectarRegionComuna(selectRegion, selectComuna, comunaInicial = "") {
	selectRegion.replaceChildren(new Option("Selecciona una region", ""));
	Datos.regiones.forEach((region) => {
		selectRegion.append(new Option(region.nombre, region.codigo));
	});

	const cargarComunas = () => {
		selectComuna.replaceChildren(new Option("Selecciona una comuna", ""));
		Datos.comunasDe(selectRegion.value).forEach((comuna) => {
			selectComuna.append(new Option(comuna.nombre, comuna.codigo));
		});
	};

	selectRegion.addEventListener("change", cargarComunas);

	if (comunaInicial) {
		const comuna = Datos.comuna(comunaInicial);
		if (comuna) {
			selectRegion.value = comuna.region;
			cargarComunas();
			selectComuna.value = comuna.codigo;
			return;
		}
	}

	cargarComunas();
}

/**
 * Ofrece los dominios permitidos como sugerencia seleccionable del campo de
 * correo, completando lo que el usuario ya escribio (RF-01 CA8).
 */
function conectarDominios(campoCorreo, listaId) {
	const lista = document.getElementById(listaId);
	if (!lista) return;

	const sugerir = () => {
		const escrito = campoCorreo.value.trim().toLowerCase();
		const local = escrito.split("@")[0];
		const opciones = local
			? DOMINIOS_PERMITIDOS.map((dominio) => `${local}${dominio}`)
			: DOMINIOS_PERMITIDOS.map((dominio) => `tucorreo${dominio}`);

		lista.replaceChildren(...opciones.map((valor) => new Option(valor, valor)));
	};

	campoCorreo.addEventListener("input", sugerir);
	sugerir();
}

window.Validaciones = {
	DOMINIOS_PERMITIDOS,
	digitoVerificador,
	runValido,
	reglas,
	configurar,
	validarCampo,
	limpiarEstados,
	aviso,
	conectarRegionComuna,
	conectarDominios,
};

/* =========================================================================
   Formularios publicos: registro de usuarios (RF-01) y contacto (RF-08)
   ========================================================================= */

/** Registro de un nuevo cliente. El rol no se escoge aqui: siempre es Cliente. */
function conectarRegistro() {
	const formulario = document.getElementById("form-registro");
	if (!formulario) return;

	const zonaAviso = document.getElementById("aviso-registro");
	const selectRegion = document.getElementById("registro-region");
	const selectComuna = document.getElementById("registro-comuna");

	conectarDominios(document.getElementById("registro-correo"), "dominios-registro");
	conectarRegionComuna(selectRegion, selectComuna);

	configurar(
		formulario,
		{
			"registro-run": [reglas.requerido(), reglas.run()],
			"registro-nombre": [reglas.requerido(), reglas.maximo(50)],
			"registro-apellidos": [reglas.requerido(), reglas.maximo(100)],
			"registro-correo": [reglas.requerido(), reglas.maximo(100), reglas.correo()],
			"registro-contrasena": [reglas.requerido(), reglas.contrasena()],
			"registro-region": [reglas.seleccion("Selecciona tu region.")],
			"registro-comuna": [reglas.seleccion("Selecciona tu comuna.")],
			"registro-direccion": [reglas.requerido(), reglas.maximo(300)],
		},
		(datos) => {
			const usuarios = Datos.usuarios();
			const run = datos.run.toUpperCase();
			const correo = datos.correo.toLowerCase();

			// El RUN es la clave de la relacion Usuario y el correo es credencial.
			if (usuarios.some((u) => u.run === run)) {
				aviso(zonaAviso, "Ya existe una cuenta registrada con ese RUN.", "danger");
				return;
			}
			if (usuarios.some((u) => u.correo.toLowerCase() === correo)) {
				aviso(zonaAviso, "Ya existe una cuenta registrada con ese correo.", "danger");
				return;
			}

			usuarios.push({
				run,
				nombre: datos.nombre,
				apellidos: datos.apellidos,
				correo,
				contrasena: datos.contrasena,
				fechaNacimiento: datos.fechaNacimiento || "",
				comuna: datos.comuna,
				direccion: datos.direccion,
				tipoUsuario: "CLIENTE",
			});
			Datos.guardarUsuarios(usuarios);

			aviso(
				zonaAviso,
				`Cuenta creada para ${escapar(datos.nombre)} ${escapar(datos.apellidos)}. Ya puedes <a href="${Rutas.a("login.html")}">iniciar sesion</a> con ${escapar(correo)}.`,
			);

			formulario.reset();
			limpiarEstados(formulario);
			conectarRegionComuna(selectRegion, selectComuna);
		},
	);
}

/** Mensaje interno a la empresa. */
function conectarContacto() {
	const formulario = document.getElementById("form-contacto");
	if (!formulario) return;

	const zonaAviso = document.getElementById("aviso-contacto");
	conectarDominios(document.getElementById("contacto-correo"), "dominios-contacto");

	configurar(
		formulario,
		{
			"contacto-nombre": [reglas.requerido(), reglas.maximo(100)],
			"contacto-correo": [reglas.requerido(), reglas.maximo(100), reglas.correo()],
			"contacto-comentario": [reglas.requerido(), reglas.maximo(500)],
		},
		(datos) => {
			aviso(
				zonaAviso,
				`Gracias ${escapar(datos.nombre)}, recibimos tu mensaje. Te responderemos a ${escapar(datos.correo.toLowerCase())} en dias habiles.`,
			);
			formulario.reset();
			limpiarEstados(formulario);
		},
	);
}

document.addEventListener("includes:loaded", () => {
	conectarRegistro();
	conectarContacto();
});

window.Validaciones.conectarRegistro = conectarRegistro;
window.Validaciones.conectarContacto = conectarContacto;
