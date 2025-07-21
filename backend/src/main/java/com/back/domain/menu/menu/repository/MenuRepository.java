package com.back.domain.menu.menu.repository;

import com.back.domain.menu.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Integer> {
}
