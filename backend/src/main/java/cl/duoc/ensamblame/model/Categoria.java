package cl.duoc.ensamblame.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Categoria del catalogo (procesadores, placas madre, etc.). */
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @Column(length = 30)
    private String codigo;

    @Column(nullable = false, length = 50)
    private String nombre;

    // Posicion en el asistente de armado; null si la categoria no participa.
    private Integer orden;

    public Categoria() {
    }

    public Categoria(String codigo, String nombre, Integer orden) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.orden = orden;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }
}
