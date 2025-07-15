package com.back.domain.menu.menu.service;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public void deleteMenu(Integer menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("해당 메뉴가 존재하지 않습니다. id=" + menuId));
        menuRepository.delete(menu);
    }
    public List<MenuResponseDto> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(MenuResponseDto::from)
                .toList();
    }
    public MenuResponseDto getMenuById(Integer menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("해당 메뉴가 존재하지 않습니다. id=" + menuId));
        return MenuResponseDto.from(menu);
    }
}
