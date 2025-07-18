package com.back.global.security;

import com.back.domain.member.member.entity.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class SecurityUser extends User {

    private final Member member;

    public SecurityUser(Member member, Collection<? extends GrantedAuthority> authorities) {
        super(member.getEmail(), member.getPassword(), authorities);
        this.member = member;
    }
}
