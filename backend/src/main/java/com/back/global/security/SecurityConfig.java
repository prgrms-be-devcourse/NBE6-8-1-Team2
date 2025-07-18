package com.back.global.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (H2 콘솔 + POST 요청 등 테스트용)
                .csrf(csrf -> csrf.disable())

                // CORS 설정
                .cors(Customizer.withDefaults())

                // H2 콘솔 접근 허용
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

                // UserDetailsService 설정
                .userDetailsService(customUserDetailsService)

                .authorizeHttpRequests(auth -> auth
                        // H2 콘솔은 모두 허용
                        .requestMatchers("/h2-console/**").permitAll()
                        // 회원가입, 로그인은 모두 허용
                        .requestMatchers("/signup", "/login").permitAll()
                        // API 문서도 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 관리자 API는 관리자만 접근 가능
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )

                // 기본 HTTP Basic 인증 비활성화 (JWT 사용)
                .httpBasic(httpBasic -> httpBasic.disable())
                
                // 폼 로그인 비활성화 (API 전용)
                .formLogin(formLogin -> formLogin.disable());

        return http.build();
    }

    // CORS 설정 (필요 시 더 구체화 가능)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // 개발 중에는 *로 두되, 배포 시 도메인 제한 권장
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}