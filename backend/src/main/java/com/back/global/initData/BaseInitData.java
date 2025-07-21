package com.back.global.initData;

import com.back.domain.member.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {
    
    private final ApplicationContext applicationContext;
    
    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            work1();
        };
    }

    private void work1() {

    }
}
