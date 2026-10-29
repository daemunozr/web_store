# Backend de Ensambla.me

API REST simple con **Spring Boot 4.1.2**, **Java 21** y **MariaDB** en un contenedor Docker.
Maneja tres recursos: categorías, productos y usuarios. El frontend React **todavía no la
usa**: sigue con sus datos simulados en `src/data/`. La API deja CORS habilitado para
`http://localhost:5173`.

## Requisitos

- JDK 21 o superior y Maven 3.9
- Docker con Docker Compose (el usuario debe poder usar Docker: estar en el grupo `docker`)

## Cómo ejecutarlo

```
cd backend
docker compose up -d        # levanta MariaDB (espera a que quede "healthy": docker compose ps)
mvn spring-boot:run         # API en http://localhost:8080
mvn test                    # pruebas unitarias (no necesitan la base)
docker compose down         # detiene la base (down -v también borra los datos)
```

Al arrancar por primera vez, `CargaInicial` crea las tablas (JPA) y carga 9 categorías, 9 productos
y 3 usuarios de ejemplo (los mismos usuarios del README principal). Si las tablas ya tienen
datos, no vuelve a cargar nada.

La conexión se configura en `src/main/resources/application.yml`. Cada valor se puede cambiar
con una variable de entorno (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`); los
valores por defecto son los de desarrollo del `docker-compose.yml`. **No sirven para producción.**

## Arquitectura (MVC)

```
cliente ──JSON──▶ controller ──▶ service ──▶ repository ──▶ MariaDB
                     │              │            │
                 dto/request    dto/response   model (entidades JPA)
```

| Paquete (`cl.duoc.ensamblame`) | Rol en MVC | Qué hace |
|---|---|---|
| `model` | Modelo | Entidades JPA: `Categoria`, `Producto`, `Usuario` y el enum `TipoUsuario` |
| `repository` | Modelo | Interfaces `JpaRepository`: Spring genera las consultas |
| `controller` | Controlador | Recibe la petición HTTP, valida el `Request` (`@Valid`) y devuelve un `ResponseEntity` |
| `dto.request` / `dto.response` | Vista | Lo que entra y lo que sale por la API en JSON. Las entidades nunca se exponen |
| `service` | Lógica | Reglas de negocio (duplicados, categoría con productos…) y paso de entidad a DTO |
| `exception` | | `ResponseEntityHandler` convierte cada excepción en una respuesta de error |
| `config` | | `CorsConfig`, `SeguridadConfig` (cifrador BCrypt) y `CargaInicial` (datos de ejemplo) |
| `util` | | `ValidadorRun`: dígito verificador del RUN (módulo 11) |

## Endpoints

| Recurso | Método y ruta | Respuesta |
|---|---|---|
| Categorías | `GET /api/categorias`, `GET /api/categorias/{codigo}` | 200 |
| | `POST /api/categorias`, `PUT /api/categorias/{codigo}` | 201 al crear, 200 al editar |
| | `DELETE /api/categorias/{codigo}` | 204 (409 si tiene productos) |
| Productos | `GET /api/productos` (opcional `?categoria=cpu` o `?q=ryzen`), `GET /api/productos/{sku}` | 200 |
| | `POST /api/productos`, `PUT /api/productos/{sku}` | 201 al crear, 200 al editar |
| | `DELETE /api/productos/{sku}` | 204 |
| Usuarios | `GET /api/usuarios`, `GET /api/usuarios/{run}` | 200 |
| | `POST /api/usuarios`, `PUT /api/usuarios/{run}` | 201 al crear, 200 al editar |
| | `DELETE /api/usuarios/{run}` | 204 |

El identificador (código, SKU o RUN) no cambia al editar: en `PUT` manda el de la ruta.

### Errores

Todos los errores tienen el mismo formato (`ErrorResponse`):

```json
{ "estado": 400, "mensaje": "Hay campos invalidos.",
  "errores": { "precio": "El precio no puede ser negativo." },
  "fecha": "2026-10-28T20:15:00" }
```

| Código | Cuándo |
|---|---|
| 400 | Falla una validación del `Request`, el JSON está mal formado o el dígito verificador del RUN no coincide |
| 404 | El registro no existe (o la categoría indicada en un producto no existe) |
| 409 | Código, SKU, RUN o correo repetido; categoría con productos |
| 500 | Error inesperado (el detalle solo queda en el log del servidor) |

### Ejemplos

```
curl http://localhost:8080/api/productos?categoria=cpu

curl -X POST http://localhost:8080/api/productos -H "Content-Type: application/json" -d '{
  "sku": "CPU-NUEVO-1", "nombre": "Procesador de prueba", "precio": 99990,
  "stock": 10, "categoria": "cpu" }'

curl -X DELETE http://localhost:8080/api/productos/CPU-NUEVO-1
```

## Reglas de validación

Son las mismas del frontend (README principal, §5): categoría con código de 3 a 30 caracteres
en minúsculas, números y guiones; producto con SKU de al menos 3 caracteres, precio ≥ 0, descuento de
0 a 90 y stock ≥ 0; usuario con RUN válido, correo de `duoc.cl`, `profesor.duoc.cl` o `gmail.com`
y contraseña de 4 a 10 caracteres.

## Simplificaciones

- Región y comuna del usuario son texto (el código, como `RM` y `RM-02`): no hay tablas de regiones ni comunas.
- La contraseña se guarda **cifrada con BCrypt** y nunca aparece en las respuestas. No hay inicio de
  sesión, tokens ni control de acceso por rol: cualquiera que llegue a la API puede usar todos los endpoints.
- `ddl-auto: update` crea y modifica las tablas solo en desarrollo; no hay scripts de migración.
- Faltan las órdenes, la compatibilidad de componentes y los blogs del modelo completo.
- Las pruebas (29) son unitarias, con Mockito y MockMvc (el controlador junto a `ResponseEntityHandler`); no hay pruebas que levanten la base de datos.
