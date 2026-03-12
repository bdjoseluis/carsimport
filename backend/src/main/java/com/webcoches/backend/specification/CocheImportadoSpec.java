package com.webcoches.backend.specification;

import com.webcoches.backend.model.CocheImportado;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class CocheImportadoSpec {

    public static Specification<CocheImportado> marcaContiene(String marca) {
        return (root, query, cb) -> marca == null ? null :
            cb.like(cb.lower(root.get("marca")), "%" + marca.toLowerCase() + "%");
    }

    public static Specification<CocheImportado> precioMaximo(BigDecimal max) {
        return (root, query, cb) -> max == null ? null :
            cb.lessThanOrEqualTo(root.get("precioConComision"), max);
    }

    public static Specification<CocheImportado> precioMinimo(BigDecimal min) {
        return (root, query, cb) -> min == null ? null :
            cb.greaterThanOrEqualTo(root.get("precioConComision"), min);
    }

    public static Specification<CocheImportado> combustible(String combustible) {
        return (root, query, cb) -> combustible == null ? null :
            cb.like(cb.lower(root.get("combustible")), "%" + combustible.toLowerCase() + "%");
    }

    public static Specification<CocheImportado> cambio(String cambio) {
        return (root, query, cb) -> cambio == null ? null :
            cb.like(cb.lower(root.get("cambio")), "%" + cambio.toLowerCase() + "%");
    }

    public static Specification<CocheImportado> soloActivos() {
        return (root, query, cb) ->
            cb.isTrue(root.get("activo"));
    }
}
