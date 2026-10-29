package cl.duoc.ensamblame.config;

import cl.duoc.ensamblame.model.Categoria;
import cl.duoc.ensamblame.model.Producto;
import cl.duoc.ensamblame.model.TipoUsuario;
import cl.duoc.ensamblame.model.Usuario;
import cl.duoc.ensamblame.repository.CategoriaRepository;
import cl.duoc.ensamblame.repository.ProductoRepository;
import cl.duoc.ensamblame.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class CargaInicial {

    @Bean
    public CommandLineRunner cargarDatos(CategoriaRepository categorias, ProductoRepository productos,
            UsuarioRepository usuarios, PasswordEncoder passwordEncoder) {
        return args -> {
            if (categorias.count() == 0) {
                cargarCatalogo(categorias, productos);
            }
            if (usuarios.count() == 0) {
                cargarUsuarios(usuarios, passwordEncoder);
            }
        };
    }

    private void cargarCatalogo(CategoriaRepository categorias, ProductoRepository productos) {
        Categoria cpu = new Categoria("cpu", "Procesadores (CPU)", 1);
        Categoria placa = new Categoria("placa", "Placas madre", 2);
        Categoria ram = new Categoria("ram", "Memoria RAM", 3);
        Categoria almacenamiento = new Categoria("almacenamiento", "Almacenamiento", 4);
        Categoria fuente = new Categoria("fuente", "Fuentes de poder", 5);
        Categoria gabinete = new Categoria("gabinete", "Gabinetes", 6);
        Categoria refrigeracion = new Categoria("refrigeracion", "Refrigeracion", 7);
        Categoria gpu = new Categoria("gpu", "Tarjetas graficas", 8);
        Categoria perifericos = new Categoria("perifericos", "Perifericos", 9);
        categorias.saveAll(List.of(cpu, placa, ram, almacenamiento, fuente, gabinete, refrigeracion, gpu,
                perifericos));

        productos.saveAll(List.of(
                producto("CPU-R5-7600", "AMD Ryzen 5 7600", "249990", 15, 18, 5, cpu),
                producto("MB-B650-PG", "ASRock B650 PG Lightning", "189990", null, 9, 3, placa),
                producto("RAM-DDR5-32-6000", "Corsair Vengeance DDR5 32 GB (2x16) 6000 MT/s", "129990", null, 15, 4, ram),
                producto("SSD-NVME-1TB", "Samsung 980 PRO 1 TB NVMe PCIe 4.0", "89990", 25, 20, 5, almacenamiento),
                producto("PSU-650-BRONZE", "Corsair CV650 650 W 80 Plus Bronze", "59990", null, 16, 4, fuente),
                producto("CASE-ATX-MESH", "NZXT H5 Flow ATX", "89990", null, 8, 3, gabinete),
                producto("COOL-AIR-TOWER", "DeepCool AK400 (aire)", "34990", null, 19, 5, refrigeracion),
                producto("GPU-RTX4060", "NVIDIA GeForce RTX 4060 8 GB", "399990", 10, 11, 4, gpu),
                producto("PER-KB-MECH", "Teclado mecanico Redragon Kumara K552", "34990", 20, 25, 6, perifericos)));
    }

    private Producto producto(String sku, String nombre, String precio, Integer descuento, int stock,
            int stockCritico, Categoria categoria) {
        Producto producto = new Producto();
        producto.setSku(sku);
        producto.setNombre(nombre);
        producto.setPrecio(new BigDecimal(precio));
        producto.setDescuento(descuento);
        producto.setStock(stock);
        producto.setStockCritico(stockCritico);
        producto.setImagen("resources/img/productos/" + sku + ".webp");
        producto.setCategoria(categoria);
        return producto;
    }

    private void cargarUsuarios(UsuarioRepository usuarios, PasswordEncoder passwordEncoder) {
        usuarios.saveAll(List.of(
                usuario("190110222", "Daniel", "Munoz Rojas", "admin@duoc.cl", "admin1234",
                        LocalDate.of(1998, 4, 12), "RM", "RM-02", "Av. Providencia 1760, Providencia",
                        TipoUsuario.ADMIN, passwordEncoder),
                usuario("152345674", "Jorge", "Perez Lillo", "bodega@duoc.cl", "bodega123",
                        LocalDate.of(1990, 9, 30), "VS", "VS-03", "Calle Valparaiso 1210, Quilpue",
                        TipoUsuario.LOGISTICA, passwordEncoder),
                usuario("123456785", "Camila", "Soto Vera", "camila@gmail.com", "cliente123",
                        LocalDate.of(2001, 1, 24), "RM", "RM-04", "Irarrazaval 2550, Nunoa",
                        TipoUsuario.CLIENTE, passwordEncoder)));
    }

    private Usuario usuario(String run, String nombre, String apellidos, String correo, String contrasena,
            LocalDate nacimiento, String region, String comuna, String direccion, TipoUsuario tipo,
            PasswordEncoder passwordEncoder) {
        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(nombre);
        usuario.setApellidos(apellidos);
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(contrasena));
        usuario.setFechaNacimiento(nacimiento);
        usuario.setRegion(region);
        usuario.setComuna(comuna);
        usuario.setDireccion(direccion);
        usuario.setTipoUsuario(tipo);
        return usuario;
    }
}
