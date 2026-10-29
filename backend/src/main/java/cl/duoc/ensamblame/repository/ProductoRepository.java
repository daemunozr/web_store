package cl.duoc.ensamblame.repository;

import cl.duoc.ensamblame.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    // Spring genera la consulta a partir del nombre del metodo.
    List<Producto> findByCategoriaCodigo(String codigoCategoria);

    boolean existsByCategoriaCodigo(String codigoCategoria);

    // Busca el texto en el nombre o en el SKU, sin distinguir mayusculas.
    List<Producto> findByNombreContainingIgnoreCaseOrSkuContainingIgnoreCase(String nombre, String sku);
}
