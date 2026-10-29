import Campo from "./Campo.jsx";
import { sugerenciasDeCorreo } from "../utils/validaciones.js";

export default function CampoCorreo({ id, value, ...props }) {
	const lista = `dominios-${id}`;
	return (
		<>
			<Campo id={id} type="email" maxLength={100} list={lista} value={value} {...props} />
			<datalist id={lista}>
				{sugerenciasDeCorreo(value).map((opcion) => (
					<option key={opcion} value={opcion} />
				))}
			</datalist>
		</>
	);
}
