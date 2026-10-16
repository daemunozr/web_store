/*
 * Acceso a los datos del sistema.
 *
 * Los mantenedores (RF-10, RF-11) y el registro (RF-01) deben poder crear
 * registros que sirvan despues para iniciar sesion, por lo que productos y
 * usuarios se leen y escriben mediante una copia de trabajo en sessionStorage
 * sembrada desde data/semillas.js. Cerrar el navegador pierde las altas de
 * prueba, pero no el carrito, que vive en localStorage (context/CarritoContext).
 */
import * as semillas from "./semillas.js";

export const { categorias, compatibilidad, regiones, comunas, roles, ordenes, itemsOrden, blogs } = semillas;

const CLAVES = { productos: "productos", usuarios: "usuarios" };

function leerCopia(clave, semilla) {
	try {
		const guardado = window.sessionStorage.getItem(clave);
		if (guardado) {
			const lista = JSON.parse(guardado);
			if (Array.isArray(lista)) return lista;
		}
	} catch (error) {
		console.error(`datos: contenido invalido en "${clave}", se vuelve a los datos de prueba`, error);
	}
	return structuredClone(semilla);
}

function guardarCopia(clave, lista) {
	try {
		window.sessionStorage.setItem(clave, JSON.stringify(lista));
	} catch (error) {
		console.error(`datos: no se pudo guardar "${clave}"`, error);
	}
	return lista;
}

/* ------------------------------------------- Productos y usuarios vigentes */
export const productos = () => leerCopia(CLAVES.productos, semillas.productos);
export const guardarProductos = (lista) => guardarCopia(CLAVES.productos, lista);
export const usuarios = () => leerCopia(CLAVES.usuarios, semillas.usuarios);
export const guardarUsuarios = (lista) => guardarCopia(CLAVES.usuarios, lista);

/* ------------------------------------------------------ Consultas de apoyo */
export const producto = (sku) => productos().find((p) => p.sku === sku);
export const usuario = (run) => usuarios().find((u) => u.run === run);
export const nombreCliente = (run) => {
	const cliente = usuario(run);
	return cliente ? `${cliente.nombre} ${cliente.apellidos}` : run;
};
export const categoria = (codigo) => categorias.find((c) => c.codigo === codigo);
export const nombreCategoria = (codigo) => categoria(codigo)?.nombre ?? codigo;
export const nombreRol = (codigo) => roles.find((r) => r.codigo === codigo)?.nombre ?? codigo;
export const comuna = (codigo) => comunas.find((c) => c.codigo === codigo);
export const comunasDe = (region) => comunas.filter((c) => c.region === region);
export const nombreComuna = (codigo) => comuna(codigo)?.nombre ?? "";
export const nombreRegionDeComuna = (codigo) =>
	regiones.find((r) => r.codigo === comuna(codigo)?.region)?.nombre ?? "";
export const blog = (slug) => blogs.find((b) => b.slug === slug);

/* ------------------------------------------------ Asistente de armado (RF-07) */
export const categoriasDeArmado = () => categorias.filter((c) => c.orden).sort((a, b) => a.orden - b.orden);
export const productosDe = (codigo) => productos().filter((p) => p.categoria === codigo);
export const admisibles = (sku) => compatibilidad.filter((c) => c.producto === sku).map((c) => c.admisible);

/* ------------------------------------------------------------ Ordenes (RF-12) */
export const orden = (numero) => ordenes.find((o) => o.numero === numero);
export const itemsDeOrden = (numero) => itemsOrden.filter((i) => i.orden === numero);
export const totalOrden = (numero) =>
	itemsDeOrden(numero).reduce((total, i) => total + i.cantidad * i.precioUnitario, 0);
