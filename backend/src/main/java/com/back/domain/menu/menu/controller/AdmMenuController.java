package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.menu.menu.service.MenuService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "AdminMenuAPI", description = "관리자가 사용하는 메뉴 CRUD API")
public class AdmMenuController {
    private final MenuRepository menuRepository;
    private final MenuService menuService;

    @PostMapping("/addmenu")
    @Transactional
    @Operation(summary = "메뉴 등록")
    public ResponseEntity<RsData<Menu>> addMenu(@Valid @RequestBody MenuDto menuDto) {
        Menu savedMenu = menuService.addMenu(menuDto);
        return ResponseEntity.ok(RsData.success("메뉴 등록 성공", savedMenu));
    }
    @PutMapping("/menus/{menuId}")
    @Transactional
    @Operation(summary = "메뉴 수정")
    public ResponseEntity<RsData<Menu>> updateMenu(@PathVariable Integer menuId, @RequestBody @Valid MenuDto menuDto) {
        Menu updatedMenu = menuService.updateMenu(menuId, menuDto);
        return ResponseEntity.ok(RsData.success("메뉴 수정 성공", updatedMenu));
    }
    @DeleteMapping("/menus/{menuId}")
    @Transactional
    @Operation(summary = "메뉴 삭제")
    public ResponseEntity<RsData<Void>> deleteMenu(@PathVariable Integer menuId) {
        menuService.deleteMenu(menuId);
        return ResponseEntity.ok(RsData.success("메뉴 삭제 성공"));
    }
    @GetMapping("/menus/{menuId}")
    @Transactional
    @Operation(summary = "메뉴 단건 조회")
    public ResponseEntity<RsData<MenuResponseDto>> getMenu(@PathVariable Integer menuId) {
        MenuResponseDto menu = menuService.getMenuById(menuId);
        return ResponseEntity.ok(RsData.success("메뉴 조회 성공", menu));
    }
    @GetMapping("/menus")
    @Transactional
    @Operation(summary = "메뉴 전체 조회")
    public ResponseEntity<RsData<List<MenuResponseDto>>> getAllMenus() {
        List<MenuResponseDto> menus = menuService.getAllMenus();
        return ResponseEntity.ok(RsData.success("전체 메뉴 조회 성공", menus));
    }
}
