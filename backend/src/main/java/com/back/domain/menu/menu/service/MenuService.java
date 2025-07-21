package com.back.domain.menu.menu.service;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.global.file.FileStorageService;
import com.back.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;
    private final FileStorageService fileStorageService;

    public Menu addMenuWithImage(MenuDto menuDto, MultipartFile imageFile) {
       Menu menu = menuDto.toEntity();
       // 이미지파일 있으면 저장
        if(imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.saveImage(imageFile);
            menu.setImageUrl(imageUrl);
            menu.setImageName(imageFile.getOriginalFilename());
        }
        return menuRepository.save(menu);
    }
    public Menu updateMenuWithImage(Integer menuId, MenuDto menuDto, MultipartFile imageFile) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(()-> new ServiceException("404-1", "메뉴를 찾을 수 없습니다"));
        menu.update(menuDto);
        if(imageFile != null && !imageFile.isEmpty()) {
            // 기존 이미지 삭제
            if (menu.getImageUrl() != null) {
                fileStorageService.deleteImage(menu.getImageUrl());
            }
            // 새 이미지 저장
            String imageUrl = fileStorageService.saveImage(imageFile);
            menu.setImageUrl(imageUrl);
            menu.setImageName(imageFile.getOriginalFilename());
        }
        return menu;
    }
    public void deleteMenu(Integer menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ServiceException("404-1", "메뉴를 찾을 수 없습니다"));
        //이미지 파일 삭제
        if (menu.getImageUrl() != null) {
            fileStorageService.deleteImage(menu.getImageUrl());
        }
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
