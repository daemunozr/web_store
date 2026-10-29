export default function CajaBusqueda({ id, etiqueta = "Buscar", placeholder, valor, onCambio, mostrados, total }) {
	return (
		<div className="mb-3">
			<label className="form-label" htmlFor={id}>
				{etiqueta}
			</label>
			<input
				id={id}
				type="search"
				className="form-control"
				placeholder={placeholder}
				maxLength={100}
				autoComplete="off"
				value={valor}
				onChange={(evento) => onCambio(evento.target.value)}
			/>
			<p className="form-text mb-0" aria-live="polite">
				{valor.trim() ? `Mostrando ${mostrados} de ${total}.` : `${total} en total.`}
			</p>
		</div>
	);
}
