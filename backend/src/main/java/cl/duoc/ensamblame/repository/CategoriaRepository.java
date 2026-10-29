package cl.duoc.ensamblame.repository;

import cl.duoc.ensamblame.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, String> {
}
