package com.back.domain.member.member.service;

import com.back.domain.member.member.entity.Member;
import com.back.standard.util.Ut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthTokenService {
    @Value("${custom.jwt.secretKey}")
    private String jwtSecretKey;

    @Value("${custom.accessToken.expirationSeconds}")
    private int accessTokenExpirationSeconds;

    @Value("${custom.refreshToken.expirationSeconds}")
    private int refreshTokenExpirationSeconds;

    String genAccessToken(Member member) {
        int id = member.getId();
        String email = member.getEmail();
        String nickName = member.getNickname();
        String role = member.getRole().name(); // 추가

        return Ut.jwt.toString(
                jwtSecretKey,
                accessTokenExpirationSeconds,
                Map.of(
                        "id", id,
                        "email", email,
                        "nickName", nickName,
                        "role", role
                )
        );
    }

    public String genRefreshToken(Member member) {
        return Ut.jwt.toString(
                jwtSecretKey,
                refreshTokenExpirationSeconds,
                Map.of("id", member.getId(), "email", member.getEmail())
        );
    }

    public Map<String, Object> payload(String accessToken) {
        Map<String, Object> parsedPayload = Ut.jwt.payload(jwtSecretKey, accessToken);

        if (parsedPayload == null) return null;

        int id = (int) parsedPayload.get("id");
        String email = (String) parsedPayload.get("email");

        return Map.of("id", id, "email", email);
    }

    public boolean isValid(String token) {
        return Ut.jwt.isValid(jwtSecretKey, token);
    }
}
