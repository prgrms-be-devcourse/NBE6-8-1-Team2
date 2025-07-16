package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.assertj.core.api.Assertions.assertThat;
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

    private Menu savedMenu;

    @BeforeEach
    void setup() {
        // 테스트용 메뉴 미리 저장
        Menu menu = new Menu("아메리카노", "기본 아메리카노", 3000, 100);
        savedMenu = menuRepository.save(menu);
    }

    @DisplayName("메뉴 추가")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t1() throws Exception {

        String requestBody = """
            {
                "name": "Coffee",
                "description": "Bitter sweet kind coffee",
                "price": 12000,
                "stock_count": 75
            }
            """;

        mockMvc.perform(post("/admin/addmenu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(AdmMenuController.class))
                .andExpect(handler().methodName("addMenu"))
                .andExpect(jsonPath("$.data.name").value("Coffee"))
                .andExpect(jsonPath("$.data.description").value("Bitter sweet kind coffee"))
                .andExpect(jsonPath("$.data.price").value(12000))
                .andExpect(jsonPath("$.data.stock_count").value(75));

        // 데이터베이스에 메뉴가 실제로 저장되었는지 확인
        assertThat(menuRepository.count()).isEqualTo(2);
        Menu savedMenu = menuRepository.findAll().get(1);
        assertThat(savedMenu.getName()).isEqualTo("Coffee");
    }

    @DisplayName("메뉴 수정")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t2() throws Exception {
        String json = """
        {
            "name": "카페모카",
            "description": "초콜릿과 커피가 만난 음료",
            "price": 4500,
            "stock_count": 60
        }
    """;

        mockMvc.perform(put("/admin/menus/{menuId}", savedMenu.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("카페모카"))
                .andExpect(jsonPath("$.data.description").value("초콜릿과 커피가 만난 음료"))
                .andExpect(jsonPath("$.data.price").value(4500))
                .andExpect(jsonPath("$.data.stock_count").value(60));
    }

    @DisplayName("메뉴 삭제")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t3() throws Exception {
        mockMvc.perform(delete("/admin/menus/{menuId}", savedMenu.getId())
                        .with(csrf()))
                .andExpect(status().isOk());

        assertFalse(menuRepository.findById(savedMenu.getId()).isPresent());
    }

    @DisplayName("메뉴 단건 조회")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t4() throws Exception {
        mockMvc.perform(get("/admin/menus/{menuId}", savedMenu.getId())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(savedMenu.getId()))
                .andExpect(jsonPath("$.data.name").value(savedMenu.getName()))
                .andExpect(jsonPath("$.data.description").value(savedMenu.getDescription()))
                .andExpect(jsonPath("$.data.price").value(savedMenu.getPrice()))
                .andExpect(jsonPath("$.data.stock_count").value(savedMenu.getStock_count()));
    }

    @DisplayName("전체 메뉴 조회")
    @Test
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void t5() throws Exception {

        Menu menu2 = new Menu("라떼", "부드러운 우유 커피", 4000, 80);
        menuRepository.save(menu2);

        mockMvc.perform(get("/admin/menus")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].id").value(savedMenu.getId()))
                .andExpect(jsonPath("$.data[0].name").value(savedMenu.getName()))
                .andExpect(jsonPath("$.data[1].name").value("라떼"))
                .andExpect(jsonPath("$.data[1].stock_count").value(80));
    }
}
