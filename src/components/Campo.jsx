export default function Campo({
	id,
	etiqueta,
	obligatorio = false,
	sugerencia,
	error = "",
	estado = "",
	como = "input",
	className = "",
	children,
	...control
}) {
	const Control = como;
	const clase = como === "select" ? "form-select" : "form-control";

	return (
		<div className={className}>
			<label className="form-label" htmlFor={id}>
				{etiqueta}
				{obligatorio && (
					<>
						{" "}
						<span className="obligatorio" aria-hidden="true">*</span>
					</>
				)}
			</label>
			<Control
				id={id}
				className={`${clase} ${estado}`.trim()}
				required={obligatorio}
				aria-invalid={estado ? String(estado === "is-invalid") : undefined}
				{...control}
			>
				{children}
			</Control>
			{error && <p className="invalid-feedback">{error}</p>}
			{sugerencia && <p className="form-text">{sugerencia}</p>}
		</div>
	);
}
