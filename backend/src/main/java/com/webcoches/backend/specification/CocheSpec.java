package com.webcoches.backend.specification;

import com.webcoches.backend.model.Coche;
import org.springframework.data.jpa.domain.Specification;

/**
 * Filtros dinamicos del catalogo propio. Cada metodo devuelve null cuando el
 * parametro no viene, de forma que Specification lo ignora y solo se aplican
 * los criterios que el usuario ha rellenado de verdad.
 */
public class CocheSpec {

    private CocheSpec() {}

    public static Specification<Coche> marcaContiene(String marca) {
        return (root, query, cb) -> vacio(marca) ? null :
            cb.like(cb.lower(root.get("marca")), "%" + marca.toLowerCase() + "%");
    }

    /** Busca el texto tanto en modelo como en version. */
    public static Specification<Coche> modeloContiene(String modelo) {
        return (root, query, cb) -> {
            if (vacio(modelo)) return null;
            String patron = "%" + modelo.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("modelo")), patron),
                cb.like(cb.lower(root.get("version")), patron));
        };
    }

    public static Specification<Coche> precioMinimo(Double min) {
        return (root, query, cb) -> min == null ? null :
            cb.greaterThanOrEqualTo(root.get("precio"), min);
    }

    public static Specification<Coche> precioMaximo(Double max) {
        return (root, query, cb) -> max == null ? null :
            cb.lessThanOrEqualTo(root.get("precio"), max);
    }

    public static Specification<Coche> anioMinimo(Integer min) {
        return (root, query, cb) -> min == null ? null :
            cb.greaterThanOrEqualTo(root.get("anio"), min);
    }

    public static Specification<Coche> anioMaximo(Integer max) {
        return (root, query, cb) -> max == null ? null :
            cb.lessThanOrEqualTo(root.get("anio"), max);
    }

    public static Specification<Coche> combustible(String combustible) {
        return (root, query, cb) -> vacio(combustible) ? null :
            cb.equal(cb.lower(root.get("combustible")), combustible.toLowerCase());
    }

    public static Specification<Coche> transmision(String transmision) {
        return (root, query, cb) -> vacio(transmision) ? null :
            cb.equal(cb.lower(root.get("transmision")), transmision.toLowerCase());
    }

    public static Specification<Coche> tipoCarroceria(String tipo) {
        return (root, query, cb) -> vacio(tipo) ? null :
            cb.equal(cb.lower(root.get("tipoCarroceria")), tipo.toLowerCase());
    }

    public static Specification<Coche> estado(String estado) {
        return (root, query, cb) -> vacio(estado) ? null :
            cb.equal(cb.lower(root.get("estado")), estado.toLowerCase());
    }

    private static boolean vacio(String valor) {
        return valor == null || valor.isBlank();
    }
}
