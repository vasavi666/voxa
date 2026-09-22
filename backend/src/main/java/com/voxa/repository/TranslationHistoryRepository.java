package com.voxa.repository;

import com.voxa.entity.TranslationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {
    
    // Spring Data JPA will automatically generate the query for this based on the method name
    List<TranslationHistory> findAllByOrderByCreatedAtDesc();
}
