package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.order.order.repository.OrderRepository;
import com.back.domain.order.order.repository.OrderMenuRepository;
import com.back.global.file.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AdmMenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderMenuRepository orderMenuRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        orderMenuRepository.deleteAll();
        orderRepository.deleteAll();
        menuRepository.deleteAll();
    }

    @DisplayName("이미지와 함께 메뉴 등록 성공")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t1() throws Exception {

        MenuDto menuDto = new MenuDto(
                "카페라떼",
                "부드러운 우유와 에스프레소",
                4500,
                80,
                "커피"
        );

        MockMultipartFile menuPart = new MockMultipartFile(
                "menu",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(menuDto)
        );

        MockMultipartFile imagePart = new MockMultipartFile(
                "image",
                "latte.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test latte image content".getBytes()
        );


        mockMvc.perform(multipart("/admin/addmenu")
                        .file(menuPart)
                        .file(imagePart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-OK"))
                .andExpect(jsonPath("$.msg").value("메뉴 등록 성공"))
                .andExpect(jsonPath("$.data.name").value("카페라떼"))
                .andExpect(jsonPath("$.data.price").value(4500))
                .andExpect(jsonPath("$.data.imageUrl").exists())
                .andExpect(jsonPath("$.data.imageName").value("latte.jpg"));

        // DB 확인
        assertThat(menuRepository.count()).isEqualTo(1);

        Menu newMenu = menuRepository.findAll().get(0);
        assertThat(newMenu.getName()).isEqualTo("카페라떼");
        assertThat(newMenu.getImageUrl()).isNotNull();
        assertThat(newMenu.getImageUrl()).startsWith("/images/");
        assertThat(newMenu.getImageName()).isEqualTo("latte.jpg");
    }

    @DisplayName("이미지 없이 메뉴 등록 성공")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t2() throws Exception {

        MenuDto menuDto = new MenuDto(
                "블랙커피",
                "진한 원두의 맛",
                2500,
                50,
                "커피"
        );

        MockMultipartFile menuPart = new MockMultipartFile(
                "menu",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(menuDto)
        );

        // 이미지 파트 없음
        mockMvc.perform(multipart("/admin/addmenu")
                        .file(menuPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-OK"))
                .andExpect(jsonPath("$.data.name").value("블랙커피"))
                .andExpect(jsonPath("$.data.price").value(2500));
        // imageUrl은 null이므로 exists() 체크 안함

        // DB 확인
        Menu newMenu = menuRepository.findAll().get(0);
        assertThat(newMenu.getName()).isEqualTo("블랙커피");
        assertThat(newMenu.getImageUrl()).isNull();
    }

    @DisplayName("메뉴 삭제 성공")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t3() throws Exception {
        // 테스트용 메뉴 생성 (이미지 있음)
        Menu menu = new Menu("삭제될메뉴", "테스트용", 3000, 50, "커피");
        menu.setImageUrl("/images/test.jpg");
        menu.setImageName("test.jpg");
        Menu savedMenu = menuRepository.save(menu);


        mockMvc.perform(delete("/admin/menus/{menuId}", savedMenu.getId())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-OK"))
                .andExpect(jsonPath("$.msg").value("메뉴 삭제 성공"));

        // DB에서 삭제 확인
        assertThat(menuRepository.findById(savedMenu.getId())).isEmpty();
        assertThat(menuRepository.count()).isEqualTo(0);
    }

    @DisplayName("메뉴 단건 조회")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t4() throws Exception {

        Menu menu = new Menu("조회용메뉴", "테스트용", 4000, 60, "커피");
        menu.setImageUrl("/images/americano.jpg");
        menu.setImageName("americano.jpg");
        Menu savedMenu = menuRepository.save(menu);


        mockMvc.perform(get("/admin/menus/{menuId}", savedMenu.getId())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(savedMenu.getId()))
                .andExpect(jsonPath("$.data.name").value("조회용메뉴"))
                .andExpect(jsonPath("$.data.description").value("테스트용"))
                .andExpect(jsonPath("$.data.price").value(4000))
                .andExpect(jsonPath("$.data.stock_count").value(60))
                .andExpect(jsonPath("$.data.imageUrl").value("/images/americano.jpg"))
                .andExpect(jsonPath("$.data.imageName").value("americano.jpg"));
    }

    @DisplayName("전체 메뉴 조회")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t5() throws Exception {

        Menu menu1 = new Menu("아메리카노", "기본 아메리카노", 3000, 100, "커피");
        Menu menu2 = new Menu("라떼", "부드러운 우유 커피", 4000, 80, "커피");
        menu2.setImageUrl("/images/latte.jpg");
        menu2.setImageName("latte.jpg");

        menuRepository.save(menu1);
        menuRepository.save(menu2);

        mockMvc.perform(get("/admin/menus")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].name").value("아메리카노"))
                .andExpect(jsonPath("$.data[1].name").value("라떼"))
                .andExpect(jsonPath("$.data[1].imageUrl").value("/images/latte.jpg"));
    }

    @DisplayName("파일 크기 초과 시 실패")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t6() throws Exception {

        MenuDto menuDto = new MenuDto(
                "대용량 메뉴",
                "큰 파일 테스트",
                5000,
                50,
                "커피"
        );

        MockMultipartFile menuPart = new MockMultipartFile(
                "menu",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(menuDto)
        );

        // 5MB 초과 파일 시뮬레이션
        byte[] largeFileContent = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeImagePart = new MockMultipartFile(
                "image",
                "large-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                largeFileContent
        );


        mockMvc.perform(multipart("/admin/addmenu")
                        .file(menuPart)
                        .file(largeImagePart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-FAIL"))  // 실제 응답에 맞춤
                .andExpect(jsonPath("$.msg").value("파일 크기는 5MB 이하여야 합니다"));
    }

    @DisplayName("유효하지 않은 파일 형식 업로드 시 실패")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t7() throws Exception {

        MenuDto menuDto = new MenuDto(
                "테스트 메뉴",
                "파일 형식 테스트",
                3000,
                30,
                "커피"
        );

        MockMultipartFile menuPart = new MockMultipartFile(
                "menu",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(menuDto)
        );
        // 텍스트 파일 일때
        MockMultipartFile textFilePart = new MockMultipartFile(
                "image",
                "document.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "This is not an image".getBytes()
        );


        mockMvc.perform(multipart("/admin/addmenu")
                        .file(menuPart)
                        .file(textFilePart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-FAIL"))  // 실제 응답에 맞춤
                .andExpect(jsonPath("$.msg").value("이미지 파일만 업로드 가능합니다"));
    }

    @DisplayName("권한 없는 사용자 접근 시 실패")
    @Test
    @WithMockUser(username = "normalUser", roles = {"USER"}) // ADMIN이 아닌 일반 USER
    void t8() throws Exception {

        MenuDto menuDto = new MenuDto(
                "권한 테스트 메뉴",
                "권한 없는 사용자 테스트",
                3000,
                40,
                "커피"
        );

        MockMultipartFile menuPart = new MockMultipartFile(
                "menu",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(menuDto)
        );


        mockMvc.perform(multipart("/admin/addmenu")
                        .file(menuPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden
    }
}