package com.back.domain.order.sales.repository;

import com.back.domain.order.sales.entity.DailySales;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailySalesRepository extends JpaRepository<DailySales, Long> {
    boolean existsByDate(LocalDate date);
    List<DailySales> findByDateBetweenOrderByDateAsc(LocalDate from, LocalDate to);
}
