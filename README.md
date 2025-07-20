# 👥 팀 소개

**프로그래머스 백엔드 데브코스 6기 8회차 2팀**

## 팀원별 개발 담당 기능

| 팀원 | GitHub | 담당 기능 |
|------|--------|-----------|
| **김주은** | [@jueunk617](https://github.com/jueunk617) | • 회원가입<br>• 로그인<br>• 주문 등록<br>• 주문 내역 조회 (마이페이지) |
| **박태규** | [@NewplayerKOR](https://github.com/NewplayerKOR) | • 주문 Entity 설계<br>• 주문서 작성<br>• 주문 총 금액 계산<br>• 주문 저장, 메뉴 조회<br>• DTO (주문 요청, 반환) |
| **서지우** | [@Jiwoo-Seo](https://github.com/Jiwoo-Seo) | • 커피 메뉴 생성 API 구현<br>• 커피 메뉴 전체 조회 API 구현<br>• 커피 메뉴 수정 API 구현<br>• 커피 메뉴 삭제 API 구현<br>• Swagger 테스트 환경 구축<br>• API 테스트 작성<br>• 권한기반(관리자) 접근제어 |
| **홍민애** | [@meohin](https://github.com/meohin) | • 메뉴 목록 조회<br>• 메뉴 등록<br>• 메뉴 수정<br>• 메뉴 삭제<br>• 주문 내역 조회 |
| **순태열** | [@SoonTaeYouL](https://github.com/SoonTaeYouL) | • 회원가입 구현<br>• 비밀번호 암호화<br>• 로그인 구현<br>• JWT 토큰<br>• 스프링 시큐리티 설정 |

---

# 🍽️ 음식 주문 시스템
> **프로그래머스 백엔드 데브코스 6기 8회차 2팀 1차 프로젝트**

![Java](https://img.shields.io/badge/Java-21-red?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-green?style=flat-square&logo=spring)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## 📝 프로젝트 개요

현대적인 **풀스택 음식 주문 시스템**으로, 사용자 친화적인 UI/UX와 안전한 백엔드 시스템을 제공합니다.

### 🎯 핵심 가치
- **사용자 중심 설계**: 직관적이고 반응형 인터페이스
- **보안 중심**: JWT 기반 인증 및 Spring Security 적용
- **확장 가능성**: 모듈화된 아키텍처와 RESTful API
- **개발자 경험**: 자동화된 문서화(Swagger) 및 테스트 환경

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄─────────────► │   Backend       │
│   (Next.js)     │                 │ (Spring Boot)   │
│   Port: 3000    │                 │   Port: 8080    │
└─────────────────┘                 └─────────────────┘
         │                                    │
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│   Browser       │                 │   MySQL         │
│   (Client)      │                 │   Database      │
└─────────────────┘                 └─────────────────┘
```

## 🛠️ 기술 스택

### 🌐 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.3.5 | React 프레임워크, SSR/SSG |
| **React** | 19 | UI 라이브러리 |
| **TypeScript** | 5 | 정적 타입 검사 |
| **Tailwind CSS** | 3.4.13 | 유틸리티 우선 CSS 프레임워크 |
| **Framer Motion** | 12.23.6 | 애니메이션 라이브러리 |
| **React Toastify** | 11.0.5 | 사용자 알림 |

### ⚙️ Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Java** | 21 | 프로그래밍 언어 |
| **Spring Boot** | 3.5.3 | 애플리케이션 프레임워크 |
| **Spring Security** | - | 보안 및 인증 (JWT) |
| **Spring Data JPA** | - | 데이터 접근 계층 |
| **MySQL** | 8.0+ | 관계형 데이터베이스 |
| **Gradle** | - | 빌드 도구 |
| **Swagger/OpenAPI** | 3.0 | API 문서화 |

## ✨ 주요 기능

### 👤 사용자 기능
- 🔐 **회원가입 / 로그인**
  - JWT 토큰 기반 인증
  - 보안 강화된 패스워드 암호화
- 📋 **메뉴 조회**
  - 카테고리별 메뉴 분류
  - 실시간 메뉴 정보 업데이트
- 🛒 **주문 시스템**
  - 장바구니 기능
  - 주문 수량 조절
  - 실시간 총 금액 계산
- 📊 **마이페이지**
  - 주문 내역 조회
  - 개인정보 관리

### 👨‍💼 관리자 기능
- 🍔 **메뉴 관리**
  - 메뉴 추가/수정/삭제
  - 이미지 업로드 기능
  - 가격 및 설명 관리
- 📦 **주문 관리**
  - 실시간 주문 현황 모니터링
  - 주문 상태 업데이트
- 📁 **파일 관리**
  - 메뉴 이미지 업로드
  - 파일 저장소 관리

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Java 21** 이상
- **Node.js 18** 이상
- **npm** 또는 **yarn**

### 🔧 설치 및 실행

#### Backend 실행
```bash
cd backend
./gradlew bootRun
```

#### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

### 🌐 접속 정보
| 서비스 | URL | 설명 |
|--------|-----|------|
| **Frontend** | http://localhost:3000 | 사용자 인터페이스 |
| **Backend API** | http://localhost:8080 | REST API 서버 |
| **API 문서** | http://localhost:8080/swagger-ui.html | Swagger UI |
| **MySQL** | localhost:3306 | 데이터베이스 서버 |

## 🎬 프로젝트 데모

### 📸 주요 화면
> *(실제 스크린샷을 여기에 추가 예정)*

- **메인 페이지**: 메뉴 목록 및 주문 인터페이스
- **관리자 대시보드**: 메뉴 및 주문 관리
- **마이페이지**: 사용자 주문 내역


## 🏗️ 프로젝트 구조

```
NBE6-8-1-Team2/
├── 📁 frontend/                 # Next.js 프론트엔드
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router 페이지
│   │   ├── 📁 _components/     # 재사용 컴포넌트
│   │   ├── 📁 _hooks/          # 커스텀 훅
│   │   ├── 📁 lib/             # 유틸리티 라이브러리
│   │   └── 📁 types/           # TypeScript 타입 정의
│   ├── 📄 package.json
│   └── 📄 next.config.ts
├── 📁 backend/                  # Spring Boot 백엔드
│   ├── 📁 src/
│   │   ├── 📁 main/java/com/back/
│   │   │   ├── 📁 domain/      # 도메인 로직
│   │   │   │   ├── 📁 member/  # 회원 관리
│   │   │   │   ├── 📁 menu/    # 메뉴 관리
│   │   │   │   └── 📁 order/   # 주문 관리
│   │   │   └── 📁 global/      # 공통 설정 및 유틸리티
│   │   └── 📁 resources/
│   ├── 📄 build.gradle.kts
│   └── 📄 api-test.http        # API 테스트 파일
└── 📄 README.md
```

## 🎯 기술적 도전과 해결

### 🔐 보안 강화
- **문제**: 사용자 인증 및 권한 관리
- **해결**: JWT 토큰 기반 인증 시스템 구축
- **결과**: 안전하고 확장 가능한 인증 체계

### 🚀 성능 최적화
- **문제**: 대용량 이미지 처리 및 로딩 속도
- **해결**: Next.js Image 컴포넌트 활용 및 이미지 최적화
- **결과**: 사용자 경험 향상

### 📱 반응형 디자인
- **문제**: 다양한 디바이스 대응
- **해결**: Tailwind CSS를 활용한 모바일 퍼스트 디자인
- **결과**: 모든 디바이스에서 일관된 사용자 경험

## 🔄 개발 프로세스

### 🌿 Git 브랜치 전략
```
main              // 최종 배포 브랜치
develop           // 개발 통합 브랜치

feat/login-api          // 백: 로그인 기능
feat/menu-crud          // 백: 메뉴 등록/수정/삭제
feat/order-create       // 백: 주문 등록 기능
feat/menu-page          // 프론트: 사용자 메뉴 보기 페이지
feat/admin-order-page   // 프론트: 관리자 주문 관리 페이지
```

- `main` : 최종 결과물
- `develop` : 개발 통합 브랜치
- `feat/*` : 기능 단위 브랜치
- 모든 브랜치는 `develop`에서 파생하여 작업
- 작업 완료 후 PR을 통해 `develop`에 merge

### 🧪 테스트 전략
- **단위 테스트**: JUnit 5 활용
- **통합 테스트**: Spring Boot Test
- **API 테스트**: REST Client 활용