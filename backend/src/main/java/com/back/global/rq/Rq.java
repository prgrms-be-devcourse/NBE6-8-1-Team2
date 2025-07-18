package com.back.global.rq;

import com.back.domain.member.member.entity.Member;
import com.back.global.security.SecurityUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse resp;

    public Member getActor() {
        return Optional.ofNullable(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        )
                .map(Authentication::getPrincipal)
                .filter(principal -> principal instanceof SecurityUser)
                .map(principal -> (SecurityUser) principal)
                .map(securityUser -> new Member(
                        securityUser.getEmail(), 
                        securityUser.getPassword(), 
                        securityUser.getNickname(), 
                        securityUser.getAddress()
                ))
                .orElse(null);
    }

    public void setCookie(String name, String value){
        if (value == null) value = "";

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain("localhost");
        cookie.setSecure(true);
        cookie.setAttribute("SameSite", "Strict");

        if (value.isBlank()) cookie.setMaxAge(0);
        else cookie.setMaxAge(60 * 60 * 24 * 365);

        resp.addCookie(cookie);
    }
}
