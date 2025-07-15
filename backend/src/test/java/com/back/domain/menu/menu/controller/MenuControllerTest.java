package com.back.domain.menu.menu.controller;

import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MenuControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MenuRepository menuRepository;

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

        mockMvc.perform(post("/admin/menus")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(MenuController.class))
                .andExpect(handler().methodName("addMenu"))
                .andExpect(jsonPath("$.name").value("Coffee"))
                .andExpect(jsonPath("$.description").value("Bitter sweet kind coffee"))
                .andExpect(jsonPath("$.price").value(12000))
                .andExpect(jsonPath("$.stock_count").value(75));

        // 데이터베이스에 메뉴가 실제로 저장되었는지 확인
        assertThat(menuRepository.count()).isEqualTo(1);
        Menu savedMenu = menuRepository.findAll().get(0);
        assertThat(savedMenu.getName()).isEqualTo("Coffee");
    }

}
