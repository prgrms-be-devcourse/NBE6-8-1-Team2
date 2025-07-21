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

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(length = 1000)
    private String refreshToken;

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

    public void updateRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void clearRefreshToken() { this.refreshToken = null; }
}