export default function Alerta({ tipo = "success", children }) {
	return (
		<div className={`alert alert-${tipo}`} role="alert">
			{children}
		</div>
	);
}

export function ZonaAviso({ aviso }) {
	return <div aria-live="polite">{aviso && <Alerta tipo={aviso.tipo}>{aviso.contenido}</Alerta>}</div>;
}
