package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.menu.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdmMenuController {
    private final MenuRepository menuRepository;
    private final MenuService menuService;

    @PostMapping("/addmenu")
    @Transactional
    public ResponseEntity<Menu> addMenu(@RequestBody Menu menu) {
        Menu savedMenu = menuRepository.save(menu);
        return ResponseEntity.ok(savedMenu);
    }
    @PutMapping("/menus/{menuId}")
    @Transactional
    public ResponseEntity<Menu> updateMenu(@PathVariable Integer menuId, @RequestBody @Valid MenuDto menuDto) {
        Menu updatedMenu = menuService.updateMenu(menuId,menuDto);
        return ResponseEntity.ok(updatedMenu);
    }
    @DeleteMapping("/menus/{menuId}")
    @Transactional
    public ResponseEntity<Void> deleteMenu(@PathVariable Integer menuId) {
        menuService.deleteMenu(menuId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/menus/{menuId}")
    @Transactional
    public ResponseEntity<MenuResponseDto> getMenu(@PathVariable Integer menuId) {
        MenuResponseDto menu = menuService.getMenuById(menuId);
        return ResponseEntity.ok(menu);
    }
    @GetMapping("/menus")
    @Transactional
    public ResponseEntity<List<MenuResponseDto>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }
}
