package com.back.domain.member.member.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    // 기존 Role 중복 삭제(태열님 코드로 교체)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // 관리자 생성 임시 메서드입니다.(추후 삭제 예정)
    public Member(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Member(String email, String password, String nickname, String address) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
    }
}