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
        // Lazy loading으로 순환 의존성 방지
        MemberService memberService = applicationContext.getBean(MemberService.class);
        PasswordEncoder passwordEncoder = applicationContext.getBean(PasswordEncoder.class);
        
        // 테스트용 계정이 없으면 생성
        if (memberService.findByEmail("test@test.com").isEmpty()) {
            memberService.join(
                "test@test.com",
                passwordEncoder.encode("1234567"),
                "테스트유저",
                "테스트주소"
            );
            System.out.println("테스트 계정 생성됨: test@test.com / 1234567");
        }
    }
}
