package com.webcoches.backend.repository;

import com.webcoches.backend.model.OfertaVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfertaVentaRepository extends JpaRepository<OfertaVenta, Long> {
    List<OfertaVenta> findByEstado(String estado);
    List<OfertaVenta> findAllByOrderByFechaSolicitudDesc();
    List<OfertaVenta> findByMarcaContainingIgnoreCase(String marca);
}
