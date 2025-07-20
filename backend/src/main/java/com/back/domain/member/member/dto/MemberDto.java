package com.back.domain.member.member.dto;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;

public record MemberDto(
        String email,
        String password,
        String nickname,
        String address,
        Role role
) {
    public MemberDto(String email, String password, String nickname, String address, Role role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
        this.role = role;
    }

    public MemberDto(Member member) {
        this(
                member.getEmail(),
                member.getPassword(),
                member.getNickname(),
                member.getAddress(),
                member.getRole()
        );
    }
}
