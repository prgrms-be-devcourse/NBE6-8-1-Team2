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
    public Menu updateMenu(Integer menuId, MenuDto menuDto) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(()-> new IllegalArgumentException("해당 메뉴가 존재하지 않습니다. id=" + menuId));
        menu.update(menuDto);
        return menu;
    }
}
