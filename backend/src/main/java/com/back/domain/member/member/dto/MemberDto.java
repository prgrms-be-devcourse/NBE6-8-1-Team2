package com.back.domain.member.member.dto;

import com.back.domain.member.member.entity.Member;

public record MemberDto(
        String email,
        String password,
        String nickname,
        String address
) {
    public MemberDto(String email, String password, String nickname, String address) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
    }

    public MemberDto(Member member) {
        this(
                member.getEmail(),
                member.getPassword(),
                member.getNickname(),
                member.getAddress()
        );
    }
}
