package com.back.domain.member.member.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "`user`")
public class Member extends BaseEntity{
    @Column(unique = true)
    private String email;
    private String nickname;
    private String password;
    private String address;

    @Column(unique = true)
    private String apiKey;

    // 기존 Role 중복 삭제(태열님 코드로 교체)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(length = 1000)
    private String refreshToken;

    // 관리자 생성 임시 메서드입니다.(추후 삭제 예정)
    public Member(String email, String password, String nickname, String address, Role role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
        this.role = role;
        this.apiKey = UUID.randomUUID().toString();
    }

    public Member(String email, String password, String nickname, String address) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
        this.apiKey = UUID.randomUUID().toString();
    }

    public void modifyApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    public void updateRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void clearRefreshToken() { this.refreshToken = null; }
}