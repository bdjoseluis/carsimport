package com.webcoches.backend.repository;

import com.webcoches.backend.model.Coche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CocheRepository
        extends JpaRepository<Coche, Long>, JpaSpecificationExecutor<Coche> {
}
