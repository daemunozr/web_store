/*
 * Sesion, roles y proteccion de vistas (RF-02, RF-13, RNF-02).
 *
 * La sesion vive en sessionStorage bajo la clave "sesion": cerrar el navegador
 * la termina, pero NO toca la clave "carrito" de localStorage, porque en esta
 * entrega el carrito se asocia al navegador y no al usuario (RF-13 CA3).
 *
 * Este script se carga en todas las vistas: pinta las acciones de sesion del
 * encabezado, marca el enlace activo del menu, escribe el ano del pie y, en el
 * panel, construye el menu vertical segun el rol. Las opciones que un rol no
 * puede usar no se insertan en el DOM (RNF-02 CA2).
 */

const CLAVE_SESION = "sesion";

/* --------------------------------------------------------- Estado de sesion */
function sesionActual() {
	try {
		const guardado = window.sessionStorage.getItem(CLAVE_SESION);
		if (!guardado) return null;
		const sesion = JSON.parse(guardado);
		return sesion && sesion.run && sesion.rol ? sesion : null;
	} catch (error) {
		console.error("sesion.js: datos de sesion invalidos, se considera sin sesion", error);
		return null;
	}
}

function guardarSesion(usuario) {
	const sesion = {
		run: usuario.run,
		nombre: usuario.nombre,
		apellidos: usuario.apellidos,
		correo: usuario.correo,
		rol: usuario.tipoUsuario,
	};
	try {
		window.sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
	} catch (error) {
		console.error("sesion.js: no se pudo guardar la sesion", error);
	}
	return sesion;
}

/** Vista a la que llega cada rol al autenticarse (RF-02 CA1). */
function inicioDeRol(rol) {
	if (rol === "ADMIN") return Rutas.a("admin/");
	if (rol === "LOGISTICA") return Rutas.a("admin/productos/");
	return Rutas.a("index.html");
}

/**
 * Busca las credenciales entre los usuarios vigentes.
 * Devuelve { ok, usuario } o { ok: false, mensaje } con un mensaje generico que
 * no revela si fallo el correo o la contrasena (RF-02 CA3).
 */
function iniciarSesion(correo, contrasena) {
	const usuario = Datos.usuarios().find(
		(u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase() && u.contrasena === contrasena,
	);

	if (!usuario) {
		return { ok: false, mensaje: "Correo o contrasena incorrectos." };
	}

	guardarSesion(usuario);
	return { ok: true, usuario };
}

/** Termina la sesion y devuelve al usuario a la tienda publica (RF-13). */
function cerrarSesion() {
	try {
		window.sessionStorage.removeItem(CLAVE_SESION);
	} catch (error) {
		console.error("sesion.js: no se pudo limpiar la sesion", error);
	}
	window.location.assign(Rutas.a("index.html"));
}

/* ------------------------------------------------------ Proteccion de vistas */
/**
 * Exige sesion y rol para ver la vista actual (RNF-02 CA1 y CA6).
 * Sin sesion redirige al inicio de sesion; con un rol que no corresponde
 * reemplaza el contenido por un aviso y no renderiza la vista.
 * Devuelve true solo cuando el acceso esta permitido.
 */
function protegerVista(rolesPermitidos) {
	const sesion = sesionActual();

	if (!sesion) {
		const destino = window.location.pathname + window.location.search;
		window.location.replace(`${Rutas.a("login/")}?destino=${encodeURIComponent(destino)}`);
		return false;
	}

	if (!rolesPermitidos.includes(sesion.rol)) {
		const main = document.querySelector("main");
		if (main) {
			main.replaceChildren();
			main.insertAdjacentHTML(
				"afterbegin",
				`<h1 class="h3 mb-3">Acceso denegado</h1>
				 <div class="alert alert-danger" role="alert">
					Tu rol (${escapar(Datos.nombreRol(sesion.rol))}) no tiene permiso para ver esta seccion.
				 </div>
				 <p><a class="btn btn-outline-primary" href="${inicioDeRol(sesion.rol)}">Ir a donde si tienes acceso</a></p>`,
			);
		}
		return false;
	}

	return true;
}

/* ------------------------------------------- Encabezado: acciones de sesion */
function pintarAccionesSesion() {
	const zona = document.getElementById("acciones-sesion");
	if (!zona) return;

	const sesion = sesionActual();
	if (!sesion) return; // El partial ya trae los enlaces de invitado.

	const enlacePanel =
		sesion.rol === "CLIENTE"
			? ""
			: `<a href="${inicioDeRol(sesion.rol)}">Panel de administracion</a>`;

	zona.innerHTML = `
		<span>Hola, ${escapar(sesion.nombre)} (${escapar(Datos.nombreRol(sesion.rol))})</span>
		${enlacePanel}
		<button type="button" class="btn btn-sm btn-outline-light" id="boton-cerrar-sesion">Cerrar sesion</button>
	`;

	document.getElementById("boton-cerrar-sesion").addEventListener("click", cerrarSesion);
}

/* -------------------------------------------- Panel: menu vertical por rol */
const OPCIONES_PANEL = [
	{ texto: "Resumen", ruta: "admin/", roles: ["ADMIN"] },
	{ texto: "Productos", ruta: "admin/productos/", roles: ["ADMIN", "LOGISTICA"] },
	{ texto: "Usuarios", ruta: "admin/usuarios/", roles: ["ADMIN"] },
	{ texto: "Ordenes", ruta: "admin/ordenes/", roles: ["ADMIN", "LOGISTICA"] },
];

function pintarMenuAdmin() {
	const menu = document.getElementById("menu-admin");
	if (!menu) return;

	const sesion = sesionActual();
	if (!sesion) return;

	const actual = window.location.pathname;
	menu.replaceChildren();

	OPCIONES_PANEL.filter((opcion) => opcion.roles.includes(sesion.rol)).forEach((opcion) => {
		const destino = Rutas.a(opcion.ruta);
		const enlace = document.createElement("a");
		enlace.className = "nav-link";
		enlace.href = destino;
		enlace.textContent = opcion.texto;
		if (actual === destino || actual === `${destino}index.html`) {
			enlace.classList.add("activo");
			enlace.setAttribute("aria-current", "page");
		}
		menu.append(enlace);
	});
}

/* ------------------------------------------------- Detalles transversales */
/** Marca en el menu superior el enlace de la vista actual. */
function marcarEnlaceActivo() {
	const actual = window.location.pathname.replace(/index\.html$/, "");

	document.querySelectorAll(".navbar-principal .nav-link").forEach((enlace) => {
		const destino = new URL(enlace.getAttribute("href"), window.location.href).pathname.replace(
			/index\.html$/,
			"",
		);
		if (destino === actual) {
			enlace.classList.add("active");
			enlace.setAttribute("aria-current", "page");
		}
	});
}

/** Ano del pie de pagina (RNF-08 CA4). */
function escribirAno() {
	const zona = document.getElementById("ano-actual");
	if (zona) zona.textContent = String(new Date().getFullYear());
}

/* ------------------------------------------------- Formulario de inicio de sesion */
/** Conecta el formulario de login con sus validaciones y la redireccion por rol. */
function conectarLogin() {
	const formulario = document.getElementById("form-login");
	if (!formulario) return;

	const zonaAviso = document.getElementById("aviso-login");
	const { reglas } = Validaciones;

	Validaciones.conectarDominios(document.getElementById("login-correo"), "dominios-login");

	Validaciones.configurar(
		formulario,
		{
			"login-correo": [reglas.requerido(), reglas.maximo(100), reglas.correo()],
			"login-contrasena": [reglas.requerido(), reglas.contrasena()],
		},
		(datos) => {
			const resultado = iniciarSesion(datos.correo, datos.contrasena);

			if (!resultado.ok) {
				Validaciones.aviso(zonaAviso, resultado.mensaje, "danger");
				return;
			}

			// "destino" solo se respeta si es una ruta de este mismo sitio.
			const pedido = new URLSearchParams(window.location.search).get("destino") ?? "";
			const destino =
				pedido.startsWith("/") && !pedido.startsWith("//")
					? pedido
					: inicioDeRol(resultado.usuario.tipoUsuario);

			window.location.assign(destino);
		},
	);
}

document.addEventListener("includes:loaded", () => {
	pintarAccionesSesion();
	pintarMenuAdmin();
	marcarEnlaceActivo();
	escribirAno();
	conectarLogin();
});

window.Sesion = {
	actual: sesionActual,
	iniciar: iniciarSesion,
	cerrar: cerrarSesion,
	proteger: protegerVista,
	inicioDeRol,
};
