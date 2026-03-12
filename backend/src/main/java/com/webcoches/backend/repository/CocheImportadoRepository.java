package com.webcoches.backend.repository;

import com.webcoches.backend.model.CocheImportado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CocheImportadoRepository
        extends JpaRepository<CocheImportado, Long>,
                JpaSpecificationExecutor<CocheImportado> {

    Optional<CocheImportado> findByApifyId(String apifyId);
    List<CocheImportado> findByActivoTrue();

    @Modifying
    @Transactional
    @Query("UPDATE CocheImportado c SET c.activo = false WHERE c.fuente = :fuente")
    void desactivarPorFuente(@Param("fuente") String fuente);
}
