package com.back.domain.menu.menu.service;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;

    public Menu addMenu(MenuDto menuDto) {
        return menuRepository.save(menuDto.toEntity());
    }
}
