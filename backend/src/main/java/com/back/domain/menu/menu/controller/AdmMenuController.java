package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.service.MenuService;
import com.back.global.file.FileStorageService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.back.global.exception.ServiceException;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "AdminMenuAPI", description = "관리자가 사용하는 메뉴 CRUD API")
public class AdmMenuController {
    private final MenuService menuService;
    private final FileStorageService fileStorageService;

    @PostMapping(value = "/addmenu", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    @Operation(summary = "메뉴 등록")
    public ResponseEntity<RsData<Menu>> addMenu(
            @RequestPart("menu") @Valid MenuDto menuDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        Menu savedMenu = menuService.addMenuWithImage(menuDto,imageFile);
        return ResponseEntity.ok(RsData.success("메뉴 등록 성공", savedMenu));
    }

    @PutMapping(value = "/menus/{menuId}")
    @Transactional
    @Operation(summary = "메뉴 수정")
    public ResponseEntity<RsData<Menu>> updateMenu(
            @PathVariable Integer menuId,
            @RequestPart(value = "menu", required = false) @Valid MenuDto menuDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request
    ) {
        // Content-Type에 따라 처리 방식 결정
        String contentType = request.getContentType();
        
        if (contentType != null && contentType.contains("application/json")) {
            // JSON 요청 처리 - RequestBody로 직접 파싱
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                MenuDto jsonMenuDto = objectMapper.readValue(request.getInputStream(), MenuDto.class);
                Menu updatedMenu = menuService.updateMenuWithImage(menuId, jsonMenuDto, null);
                return ResponseEntity.ok(RsData.success("메뉴 수정 성공", updatedMenu));
            } catch (Exception e) {
                throw new ServiceException("400-1", "잘못된 요청 형식입니다");
            }
        } else {
            // Multipart 요청 처리
            if (menuDto == null) {
                throw new ServiceException("400-1", "메뉴 정보가 필요합니다");
            }
            Menu updatedMenu = menuService.updateMenuWithImage(menuId, menuDto, imageFile);
            return ResponseEntity.ok(RsData.success("메뉴 수정 성공", updatedMenu));
        }
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
