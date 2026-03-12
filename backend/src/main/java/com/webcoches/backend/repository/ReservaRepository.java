package com.webcoches.backend.repository;

import com.webcoches.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByCocheId(Long cocheId);
    List<Reserva> findByEstado(String estado);
    List<Reserva> findAllByOrderByFechaSolicitudDesc();
}
