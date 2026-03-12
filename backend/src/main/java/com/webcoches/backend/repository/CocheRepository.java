package com.webcoches.backend.repository;
import com.webcoches.backend.model.Coche;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CocheRepository extends JpaRepository<Coche, Long> {
}
