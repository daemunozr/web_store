/*
 * Panel de administracion: mantenedores de Productos y Usuarios (RF-10, RF-11)
 * y consulta de productos y ordenes en solo lectura (RF-12).
 *
 * Cada vista parte protegiendo el acceso con Sesion.proteger: sin sesion se
 * redirige al inicio de sesion y con un rol que no corresponde no se renderiza
 * nada (RNF-02 CA1 y CA6). El rol Administrador logistico ve el listado de
 * productos y las ordenes, siempre sin acciones de creacion ni edicion.
 *
 * Ninguna vista ofrece Eliminar: queda fuera del alcance de esta entrega
 * (RF-10 CA6, RF-11 CA5).
 */

const esAdministrador = () => Sesion.actual()?.rol === "ADMIN";

const parametro = (nombre) => new URLSearchParams(window.location.search).get(nombre) ?? "";

/** Un producto esta en stock critico cuando su stock no supera el umbral. */
const enStockCritico = (producto) =>
	producto.stockCritico !== "" &&
	producto.stockCritico !== null &&
	producto.stockCritico !== undefined &&
	Number(producto.stock) <= Number(producto.stockCritico);

/* =========================================================================
   Resumen del panel (home administrativo)
   ========================================================================= */
function iniciarResumen() {
	if (!Sesion.proteger(["ADMIN"])) return;

	const productos = Datos.productos();
	const criticos = productos.filter(enStockCritico);
	const vendido = Datos.ordenes.reduce((total, orden) => total + Datos.totalOrden(orden.numero), 0);

	const indicadores = [
		{ titulo: "Productos en catalogo", valor: productos.length, nota: `${Datos.categorias.length} categorias` },
		{ titulo: "En stock critico", valor: criticos.length, nota: "Requieren reposicion" },
		{ titulo: "Usuarios registrados", valor: Datos.usuarios().length, nota: `${Datos.roles.length} roles` },
		{ titulo: "Ordenes simuladas", valor: Datos.ordenes.length, nota: `${Datos.precio(vendido)} en total` },
	];

	document.getElementById("indicadores").innerHTML = indicadores
		.map(
			(indicador) => `
				<div class="col">
					<article class="tarjeta-indicador h-100 p-3">
						<p class="etiqueta-categoria mb-1">${escapar(indicador.titulo)}</p>
						<p class="cifra mb-1">${indicador.valor}</p>
						<p class="small text-secondary mb-0">${indicador.nota}</p>
					</article>
				</div>
			`,
		)
		.join("");

	const accesos = [
		{
			titulo: "Mantenedor de Productos",
			texto: "Listar, crear y editar los productos del catalogo, con alerta de bajo inventario.",
			ruta: "admin/productos.html",
			boton: "Abrir productos",
		},
		{
			titulo: "Mantenedor de Usuarios",
			texto: "Listar, crear y editar usuarios, y asignarles su tipo de usuario.",
			ruta: "admin/usuarios.html",
			boton: "Abrir usuarios",
		},
		{
			titulo: "Ordenes",
			texto: "Consultar las ordenes simuladas y su detalle en modo de solo lectura.",
			ruta: "admin/ordenes.html",
			boton: "Abrir ordenes",
		},
	];

	document.getElementById("accesos-panel").innerHTML = accesos
		.map(
			(acceso) => `
				<div class="col">
					<article class="card h-100">
						<div class="card-body d-flex flex-column">
							<h2 class="h6 card-title">${acceso.titulo}</h2>
							<p class="card-text small">${acceso.texto}</p>
							<a class="btn btn-sm btn-outline-primary mt-auto align-self-start" href="${Rutas.a(acceso.ruta)}">
								${acceso.boton}
							</a>
						</div>
					</article>
				</div>
			`,
		)
		.join("");
}

/* =========================================================================
   Productos: listado (RF-10 CA1, CA4; RF-12 CA1)
   ========================================================================= */
function iniciarListadoProductos() {
	if (!Sesion.proteger(["ADMIN", "LOGISTICA"])) return;

	const puedeEditar = esAdministrador();
	const productos = Datos.productos();

	const modo = document.getElementById("modo-productos");
	if (modo) {
		modo.textContent = puedeEditar
			? `${productos.length} productos en el catalogo.`
			: `${productos.length} productos en el catalogo. Vista de solo lectura.`;
	}

	// El boton de crear solo existe para el rol Administrador (RF-12 CA1).
	const acciones = document.getElementById("acciones-productos");
	if (acciones && puedeEditar) {
		acciones.innerHTML = `<a class="btn btn-primary" href="${Rutas.a("admin/producto.html")}">Nuevo producto</a>`;
	}

	const guardado = parametro("guardado");
	if (guardado) {
		Validaciones.aviso(
			document.getElementById("aviso-productos"),
			`El producto <strong>${escapar(guardado)}</strong> se guardo correctamente.`,
		);
	}

	const contenedor = document.getElementById("tabla-productos");

	if (!productos.length) {
		contenedor.innerHTML = '<div class="estado-vacio"><p class="mb-0">No hay productos cargados.</p></div>';
		return;
	}

	const filas = productos
		.map((producto) => {
			const critico = enStockCritico(producto);
			const detalle = Rutas.a(`producto.html?sku=${encodeURIComponent(producto.sku)}`);

			return `
				<tr class="${critico ? "fila-stock-critico" : ""}">
					<td>
						${
							producto.imagen
								? `<img src="${Rutas.recurso(producto.imagen)}" alt="" class="miniatura">`
								: ""
						}
					</td>
					<td><code>${escapar(producto.sku)}</code></td>
					<td><a class="enlace-producto" href="${detalle}">${escapar(producto.nombre)}</a></td>
					<td>${escapar(Datos.nombreCategoria(producto.categoria))}</td>
					<td class="text-end">${producto.precio === 0 ? "Gratis" : Datos.precio(producto.precio)}</td>
					<td class="text-end">${producto.stock}</td>
					<td class="text-end">${producto.stockCritico === "" ? "&mdash;" : escapar(producto.stockCritico)}</td>
					<td>${critico ? '<span class="alerta-stock">Stock critico</span>' : ""}</td>
					${
						puedeEditar
							? `<td class="text-end">
									<a class="btn btn-sm btn-outline-primary" href="${Rutas.a(`admin/producto.html?sku=${encodeURIComponent(producto.sku)}`)}">
										Editar
									</a>
							   </td>`
							: ""
					}
				</tr>
			`;
		})
		.join("");

	contenedor.innerHTML = `
		<table class="table table-hover tabla-admin align-middle">
			<caption class="visually-hidden">Listado de productos del catalogo</caption>
			<thead>
				<tr>
					<th scope="col">Imagen</th>
					<th scope="col">Codigo</th>
					<th scope="col">Nombre</th>
					<th scope="col">Categoria</th>
					<th scope="col" class="text-end">Precio</th>
					<th scope="col" class="text-end">Stock</th>
					<th scope="col" class="text-end">Critico</th>
					<th scope="col">Alerta</th>
					${puedeEditar ? '<th scope="col" class="text-end">Acciones</th>' : ""}
				</tr>
			</thead>
			<tbody>${filas}</tbody>
		</table>
	`;
}

/* =========================================================================
   Productos: formulario de creacion y edicion (RF-10)
   ========================================================================= */
function iniciarFormularioProducto() {
	if (!Sesion.proteger(["ADMIN"])) return;

	const formulario = document.getElementById("form-producto");
	const zonaAviso = document.getElementById("aviso-producto");
	const { reglas } = Validaciones;

	const selectCategoria = document.getElementById("producto-categoria");
	selectCategoria.replaceChildren(new Option("Selecciona una categoria", ""));
	Datos.categorias.forEach((categoria) => {
		selectCategoria.append(new Option(categoria.nombre, categoria.codigo));
	});

	// Con el parametro sku la vista edita; sin el, crea.
	const sku = parametro("sku");
	const existente = sku ? Datos.producto(sku) : null;

	if (sku && !existente) {
		Validaciones.aviso(zonaAviso, `No existe un producto con el codigo ${escapar(sku)}.`, "danger");
	}

	if (existente) {
		document.getElementById("titulo-formulario-producto").textContent = `Editar ${existente.nombre}`;
		document.title = `Editar ${existente.nombre} — Panel Ensambla.me`;

		const campoSku = document.getElementById("producto-sku");
		campoSku.value = existente.sku;
		campoSku.readOnly = true; // El codigo identifica al producto y no se cambia.
		document.getElementById("producto-nombre").value = existente.nombre;
		document.getElementById("producto-descripcion").value = existente.descripcion ?? "";
		document.getElementById("producto-precio").value = existente.precio;
		document.getElementById("producto-stock").value = existente.stock;
		document.getElementById("producto-stock-critico").value = existente.stockCritico ?? "";
		selectCategoria.value = existente.categoria;
		document.getElementById("producto-imagen").value = existente.imagen ?? "";
		document.getElementById("producto-video").value = existente.video ?? "";
	}

	Validaciones.configurar(
		formulario,
		{
			"producto-sku": [reglas.requerido(), reglas.minimo(3)],
			"producto-nombre": [reglas.requerido(), reglas.maximo(100)],
			"producto-descripcion": [reglas.maximo(500)],
			"producto-precio": [reglas.requerido(), reglas.numeroMinimo(0)],
			"producto-stock": [reglas.requerido(), reglas.numeroMinimo(0), reglas.entero()],
			"producto-stock-critico": [reglas.numeroMinimo(0), reglas.entero()],
			"producto-categoria": [reglas.seleccion("Selecciona la categoria del producto.")],
		},
		(datos) => {
			const productos = Datos.productos();
			const codigo = datos.sku;

			if (!existente && productos.some((producto) => producto.sku === codigo)) {
				Validaciones.aviso(zonaAviso, `Ya existe un producto con el codigo ${escapar(codigo)}.`, "danger");
				return;
			}

			const guardado = {
				sku: codigo,
				nombre: datos.nombre,
				descripcion: datos.descripcion,
				precio: Number(datos.precio),
				stock: Number(datos.stock),
				stockCritico: datos.stockCritico === "" ? "" : Number(datos.stockCritico),
				categoria: datos.categoria,
				imagen: datos.imagen,
				video: datos.video,
			};

			const posicion = productos.findIndex((producto) => producto.sku === codigo);
			if (posicion === -1) productos.push(guardado);
			else productos[posicion] = guardado;

			Datos.guardarProductos(productos);
			window.location.assign(`${Rutas.a("admin/productos.html")}?guardado=${encodeURIComponent(codigo)}`);
		},
	);
}

/* =========================================================================
   Usuarios: listado (RF-11 CA1)
   ========================================================================= */
function iniciarListadoUsuarios() {
	if (!Sesion.proteger(["ADMIN"])) return;

	const usuarios = Datos.usuarios();

	document.getElementById("acciones-usuarios").innerHTML =
		`<a class="btn btn-primary" href="${Rutas.a("admin/usuario.html")}">Nuevo usuario</a>`;

	const guardado = parametro("guardado");
	if (guardado) {
		Validaciones.aviso(
			document.getElementById("aviso-usuarios"),
			`El usuario con RUN <strong>${escapar(guardado)}</strong> se guardo correctamente.`,
		);
	}

	const contenedor = document.getElementById("tabla-usuarios");

	if (!usuarios.length) {
		contenedor.innerHTML = '<div class="estado-vacio"><p class="mb-0">No hay usuarios cargados.</p></div>';
		return;
	}

	const filas = usuarios
		.map(
			(usuario) => `
				<tr>
					<td><code>${escapar(usuario.run)}</code></td>
					<td>${escapar(usuario.nombre)} ${escapar(usuario.apellidos)}</td>
					<td>${escapar(usuario.correo)}</td>
					<td>${escapar(Datos.nombreRol(usuario.tipoUsuario))}</td>
					<td>${escapar(Datos.nombreComuna(usuario.comuna))}, ${escapar(Datos.nombreRegionDeComuna(usuario.comuna))}</td>
					<td class="text-end">
						<a class="btn btn-sm btn-outline-primary" href="${Rutas.a(`admin/usuario.html?run=${encodeURIComponent(usuario.run)}`)}">
							Editar
						</a>
					</td>
				</tr>
			`,
		)
		.join("");

	contenedor.innerHTML = `
		<table class="table table-hover tabla-admin align-middle">
			<caption class="visually-hidden">Listado de usuarios del sistema</caption>
			<thead>
				<tr>
					<th scope="col">RUN</th>
					<th scope="col">Nombre</th>
					<th scope="col">Correo</th>
					<th scope="col">Tipo de usuario</th>
					<th scope="col">Comuna</th>
					<th scope="col" class="text-end">Acciones</th>
				</tr>
			</thead>
			<tbody>${filas}</tbody>
		</table>
	`;
}

/* =========================================================================
   Usuarios: formulario de creacion y edicion (RF-11)
   ========================================================================= */
function iniciarFormularioUsuario() {
	if (!Sesion.proteger(["ADMIN"])) return;

	const formulario = document.getElementById("form-usuario");
	const zonaAviso = document.getElementById("aviso-usuario");
	const { reglas } = Validaciones;

	// El select de tipo de usuario ofrece exactamente los tres roles (RF-11 CA3).
	const selectTipo = document.getElementById("usuario-tipo");
	selectTipo.replaceChildren(new Option("Selecciona un tipo", ""));
	Datos.roles.forEach((rol) => selectTipo.append(new Option(rol.nombre, rol.codigo)));

	const selectRegion = document.getElementById("usuario-region");
	const selectComuna = document.getElementById("usuario-comuna");

	Validaciones.conectarDominios(document.getElementById("usuario-correo"), "dominios-usuario");

	const run = parametro("run");
	const existente = run ? Datos.usuario(run) : null;

	if (run && !existente) {
		Validaciones.aviso(zonaAviso, `No existe un usuario con RUN ${escapar(run)}.`, "danger");
	}

	Validaciones.conectarRegionComuna(selectRegion, selectComuna, existente?.comuna ?? "");

	if (existente) {
		document.getElementById("titulo-formulario-usuario").textContent =
			`Editar ${existente.nombre} ${existente.apellidos}`;
		document.title = `Editar usuario — Panel Ensambla.me`;

		const campoRun = document.getElementById("usuario-run");
		campoRun.value = existente.run;
		campoRun.readOnly = true; // El RUN identifica al usuario y no se cambia.
		document.getElementById("usuario-nombre").value = existente.nombre;
		document.getElementById("usuario-apellidos").value = existente.apellidos;
		document.getElementById("usuario-correo").value = existente.correo;
		document.getElementById("usuario-contrasena").value = existente.contrasena;
		document.getElementById("usuario-nacimiento").value = existente.fechaNacimiento ?? "";
		document.getElementById("usuario-direccion").value = existente.direccion;
		selectTipo.value = existente.tipoUsuario;
	}

	Validaciones.configurar(
		formulario,
		{
			"usuario-run": [reglas.requerido(), reglas.run()],
			"usuario-nombre": [reglas.requerido(), reglas.maximo(50)],
			"usuario-apellidos": [reglas.requerido(), reglas.maximo(100)],
			"usuario-correo": [reglas.requerido(), reglas.maximo(100), reglas.correo()],
			"usuario-contrasena": [reglas.requerido(), reglas.contrasena()],
			"usuario-tipo": [reglas.seleccion("Selecciona el tipo de usuario.")],
			"usuario-region": [reglas.seleccion("Selecciona la region.")],
			"usuario-comuna": [reglas.seleccion("Selecciona la comuna.")],
			"usuario-direccion": [reglas.requerido(), reglas.maximo(300)],
		},
		(datos) => {
			const usuarios = Datos.usuarios();
			const identificador = datos.run.toUpperCase();
			const correo = datos.correo.toLowerCase();

			if (!existente && usuarios.some((usuario) => usuario.run === identificador)) {
				Validaciones.aviso(zonaAviso, `Ya existe un usuario con RUN ${escapar(identificador)}.`, "danger");
				return;
			}
			if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo && usuario.run !== identificador)) {
				Validaciones.aviso(zonaAviso, `El correo ${escapar(correo)} ya esta usado por otro usuario.`, "danger");
				return;
			}

			const guardado = {
				run: identificador,
				nombre: datos.nombre,
				apellidos: datos.apellidos,
				correo,
				contrasena: datos.contrasena,
				fechaNacimiento: datos.fechaNacimiento || "",
				comuna: datos.comuna,
				direccion: datos.direccion,
				tipoUsuario: datos.tipoUsuario,
			};

			const posicion = usuarios.findIndex((usuario) => usuario.run === identificador);
			if (posicion === -1) usuarios.push(guardado);
			else usuarios[posicion] = guardado;

			Datos.guardarUsuarios(usuarios);
			window.location.assign(`${Rutas.a("admin/usuarios.html")}?guardado=${encodeURIComponent(identificador)}`);
		},
	);
}

/* =========================================================================
   Ordenes: listado y detalle, siempre en solo lectura (RF-12 CA2)
   ========================================================================= */
const nombreCliente = (run) => {
	const usuario = Datos.usuario(run);
	return usuario ? `${usuario.nombre} ${usuario.apellidos}` : run;
};

function iniciarListadoOrdenes() {
	if (!Sesion.proteger(["ADMIN", "LOGISTICA"])) return;

	const contenedor = document.getElementById("tabla-ordenes");

	if (!Datos.ordenes.length) {
		contenedor.innerHTML = '<div class="estado-vacio"><p class="mb-0">No hay ordenes registradas.</p></div>';
		return;
	}

	const filas = Datos.ordenes
		.map((orden) => {
			const items = Datos.itemsDeOrden(orden.numero);
			const productos = items
				.map((item) => `${escapar(Datos.producto(item.producto)?.nombre ?? item.producto)} (x${item.cantidad})`)
				.join("<br>");

			return `
				<tr>
					<td><code>${escapar(orden.numero)}</code></td>
					<td>${escapar(nombreCliente(orden.cliente))}<br><span class="small text-secondary">${escapar(orden.cliente)}</span></td>
					<td>${Datos.fecha(orden.fecha)}</td>
					<td class="small">${productos}</td>
					<td class="text-end">${Datos.precio(Datos.totalOrden(orden.numero))}</td>
					<td class="text-end">
						<a class="btn btn-sm btn-outline-primary" href="${Rutas.a(`admin/orden.html?orden=${encodeURIComponent(orden.numero)}`)}">
							Ver detalle
						</a>
					</td>
				</tr>
			`;
		})
		.join("");

	contenedor.innerHTML = `
		<table class="table table-hover tabla-admin align-middle">
			<caption class="visually-hidden">Listado de ordenes de compra</caption>
			<thead>
				<tr>
					<th scope="col">Orden</th>
					<th scope="col">Cliente</th>
					<th scope="col">Fecha</th>
					<th scope="col">Productos</th>
					<th scope="col" class="text-end">Total</th>
					<th scope="col" class="text-end">Detalle</th>
				</tr>
			</thead>
			<tbody>${filas}</tbody>
		</table>
	`;
}

function iniciarDetalleOrden() {
	if (!Sesion.proteger(["ADMIN", "LOGISTICA"])) return;

	const contenedor = document.getElementById("detalle-orden");
	const numero = parametro("orden");
	const orden = Datos.ordenes.find((o) => o.numero === numero);

	if (!orden) {
		contenedor.innerHTML = `
			<h1 class="h3">Orden no encontrada</h1>
			<div class="estado-vacio">
				<p>No existe una orden con el numero <strong>${escapar(numero) || "(sin numero)"}</strong>.</p>
				<a class="btn btn-primary" href="${Rutas.a("admin/ordenes.html")}">Volver a las ordenes</a>
			</div>
		`;
		return;
	}

	document.title = `Orden ${orden.numero} — Panel Ensambla.me`;
	const items = Datos.itemsDeOrden(orden.numero);
	const usuario = Datos.usuario(orden.cliente);

	const filas = items
		.map((item) => {
			const producto = Datos.producto(item.producto);
			return `
				<tr>
					<td><code>${escapar(item.producto)}</code></td>
					<td>${escapar(producto?.nombre) || "Producto fuera del catalogo"}</td>
					<td class="text-end">${item.cantidad}</td>
					<td class="text-end">${Datos.precio(item.precioUnitario)}</td>
					<td class="text-end">${Datos.precio(item.cantidad * item.precioUnitario)}</td>
				</tr>
			`;
		})
		.join("");

	contenedor.innerHTML = `
		<p class="sobretitulo">Consulta</p>
		<h1 class="h3">Orden ${escapar(orden.numero)}</h1>
		<p class="solo-lectura mb-4">Vista de solo lectura.</p>

		<dl class="row small">
			<dt class="col-4 col-md-3">Cliente</dt>
			<dd class="col-8 col-md-9">${escapar(nombreCliente(orden.cliente))} (RUN ${escapar(orden.cliente)})</dd>
			<dt class="col-4 col-md-3">Correo</dt>
			<dd class="col-8 col-md-9">${escapar(usuario?.correo) || "&mdash;"}</dd>
			<dt class="col-4 col-md-3">Despacho</dt>
			<dd class="col-8 col-md-9">
				${usuario ? `${escapar(usuario.direccion)}, ${escapar(Datos.nombreComuna(usuario.comuna))}` : "&mdash;"}
			</dd>
			<dt class="col-4 col-md-3">Fecha</dt>
			<dd class="col-8 col-md-9">${Datos.fecha(orden.fecha)}</dd>
		</dl>

		<div class="table-responsive">
			<table class="table tabla-admin">
				<caption class="visually-hidden">Detalle de los productos de la orden</caption>
				<thead>
					<tr>
						<th scope="col">Codigo</th>
						<th scope="col">Producto</th>
						<th scope="col" class="text-end">Cantidad</th>
						<th scope="col" class="text-end">Precio unitario</th>
						<th scope="col" class="text-end">Subtotal</th>
					</tr>
				</thead>
				<tbody>${filas}</tbody>
				<tfoot>
					<tr>
						<th scope="row" colspan="4" class="text-end">Total de la orden</th>
						<td class="text-end precio">${Datos.precio(Datos.totalOrden(orden.numero))}</td>
					</tr>
				</tfoot>
			</table>
		</div>

		<p><a class="btn btn-outline-primary" href="${Rutas.a("admin/ordenes.html")}">Volver a las ordenes</a></p>
	`;
}

/* --------------------------------------------------------------- Arranque */
document.addEventListener("includes:loaded", () => {
	if (document.getElementById("panel-resumen")) iniciarResumen();
	if (document.getElementById("tabla-productos")) iniciarListadoProductos();
	if (document.getElementById("form-producto")) iniciarFormularioProducto();
	if (document.getElementById("tabla-usuarios")) iniciarListadoUsuarios();
	if (document.getElementById("form-usuario")) iniciarFormularioUsuario();
	if (document.getElementById("tabla-ordenes")) iniciarListadoOrdenes();
	if (document.getElementById("detalle-orden")) iniciarDetalleOrden();
});

window.Mantenedores = {
	enStockCritico,
	iniciarResumen,
	iniciarListadoProductos,
	iniciarFormularioProducto,
	iniciarListadoUsuarios,
	iniciarFormularioUsuario,
	iniciarListadoOrdenes,
	iniciarDetalleOrden,
};
