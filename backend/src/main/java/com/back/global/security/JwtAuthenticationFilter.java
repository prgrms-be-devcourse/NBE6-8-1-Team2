package com.back.global.security;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static com.back.standard.util.Ut.jwt;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final MemberRepository memberRepository;

    @Value("${custom.jwt.secretKey}")
    private String secret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractAccessTokenFromCookie(request);

        if (token != null && jwt.isValid(secret, token)) {
            Map<String, Object> payload = jwt.payload(secret, token);
            String email = (String) payload.get("email");

            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

            List<SimpleGrantedAuthority> authorities =
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole().name()));

            SecurityUser securityUser = new SecurityUser(member, authorities); // 진짜 Member 전달

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(securityUser, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extractAccessTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
