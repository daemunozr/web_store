package cl.duoc.ensamblame.repository;

import cl.duoc.ensamblame.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    List<Producto> findByCategoriaCodigo(String codigoCategoria);

    boolean existsByCategoriaCodigo(String codigoCategoria);

    List<Producto> findByNombreContainingIgnoreCaseOrSkuContainingIgnoreCase(String nombre, String sku);
}
