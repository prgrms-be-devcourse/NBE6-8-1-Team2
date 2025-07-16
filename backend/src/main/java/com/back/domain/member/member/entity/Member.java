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

    public enum Role {
        USER, // 일반 사용자
        ADMIN // 관리자
    }
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public Member(String email, String password) {
        this.email = email;
        this.password = password;
        this.role = Role.USER;
    }

    // 관리자 생성 임시 메서드입니다.(추후 삭제 예정)
    public Member(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }


    public String getNickname() {
        return nickname;
    }
}