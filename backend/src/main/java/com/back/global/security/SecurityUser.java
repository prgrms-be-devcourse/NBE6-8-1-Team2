package com.back.global.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class SecurityUser extends User {
    @Getter
    private String email;
    @Getter
    private String nickname;
    @Getter
    private String address;

    public SecurityUser(String email, String nickname, String password, Collection<? extends GrantedAuthority> authorities) {
        super(email, password, authorities);
        this.email = email;
        this.nickname = nickname;
        this.address = address;
    }
}
