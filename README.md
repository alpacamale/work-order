# 📝 Project: 게시판 + 채팅 백엔드 API

이 프로젝트는 **사용자 인증, 게시글/댓글 관리, 채팅방/메시지 기능**을 포함한 백엔드 API입니다.  
서비스 레이어를 분리하여 유지보수성과 테스트 용이성을 높였습니다.

---

## 🚀 기술 스택

- Node.js (v20)
- Express.js
- MongoDB (Mongoose ODM)
- JWT (인증/인가)
- Jest + Supertest (E2E 테스트)
- bcrypt (비밀번호 해시)

---

## 📂 주요 기능

### 👤 Users & Auth

- 회원가입
- 로그인 (JWT 발급)
- 비밀번호 해시 저장

### 📝 Posts & Comments

- 게시글 CRUD
- 댓글 CRUD
- 멘션 기능: `@username` → 해당 유저 ObjectId로 변환
- 권한 제어:
  - 작성자 또는 멘션된 사용자만 글 조회/수정 가능
  - 작성자 본인만 수정/삭제 가능

### 💬 ChatRooms & Messages

- 채팅방 생성/조회/수정/삭제
- 메시지 작성/조회/수정/삭제
- 메시지 내 멘션 → 방에 없는 유저 자동 초대

---

## ⚙️ 실행 방법

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your_jwt_secret_key
```

- `DB_URL` : MongoDB 접속 주소
- `JWT_SECRET` : JWT 토큰 서명용 시크릿 키

---

### 2. 실행 명령어

```bash
# 프로덕션 실행
npm start

# 개발 모드 (nodemon)
npm run dev

# 테스트 (MongoMemoryServer 사용)
npm test
```

---

## 🏗️ 아키텍처 구조

```

src/
├── controllers/ # 요청/응답 처리
├── services/ # 비즈니스 로직
├── models/ # Mongoose 스키마
├── routes/ # Express 라우트
└── utils/ # AppError 등 유틸

```

- **Controller**: 요청 파라미터/응답 처리
- **Service Layer**: 비즈니스 로직 (DB 접근, 권한 확인 등)
- **Model**: MongoDB 스키마 정의

---

## 📋 API 명세서

## 👤 User CRUD

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/v1/users`     | 모든 사용자 조회          |
| GET    | `/v1/users/:id` | 특정 사용자 조회          |
| POST   | `/v1/users`     | 새 사용자 생성 (회원가입) |
| PUT    | `/v1/users/:id` | 사용자 정보 수정          |
| DELETE | `/v1/users/:id` | 사용자 삭제 (회원탈퇴)    |

---

## 📝 Post CRUD

| Method | Endpoint                 | Description                                           |
| ------ | ------------------------ | ----------------------------------------------------- |
| GET    | `/v1/posts`              | 모든 게시글 조회                                      |
| GET    | `/v1/posts/:id`          | 특정 게시글 조회                                      |
| POST   | `/v1/posts`              | 새 게시글 생성                                        |
| PUT    | `/v1/posts/:id`          | 게시글 수정                                           |
| DELETE | `/v1/posts/:id`          | 게시글 삭제                                           |
| PATCH  | `/v1/posts/:id/category` | 카테고리 상태 변경 (공지사항/새로운 작업/진행중/완료) |

---

## 💬 Comment CRUD

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/v1/posts/:id/comments` | 특정 게시글의 댓글 조회 |
| POST   | `/v1/posts/:id/comments` | 특정 게시글에 댓글 작성 |
| PUT    | `/v1/comments/:id`       | 댓글 수정               |
| DELETE | `/v1/comments/:id`       | 댓글 삭제               |

---

## 🔐 Auth

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/v1/auth/login`  | 로그인 (JWT 토큰 발급) |
| POST   | `/v1/auth/logout` | 로그아웃               |

---

## 📡 ChatRoom

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/v1/chat-rooms`     | 채팅방 생성      |
| GET    | `/v1/chat-rooms/:id` | 특정 채팅방 조회 |
| GET    | `/v1/chat-rooms`     | 모든 채팅방 조회 |
| PUT    | `/v1/chat-rooms/:id` | 채팅방 수정      |
| DELETE | `/v1/chat-rooms/:id` | 채팅방 삭제      |

---

## 💭 Message

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/v1/chat-rooms/:id/messages` | 메시지 생성 (멘션 시 자동 초대) |
| GET    | `/v1/chat-rooms/:id/messages` | 메시지 조회                     |
| PUT    | `/v1/messages/:id`            | 메시지 수정                     |
| DELETE | `/v1/messages/:id`            | 메시지 삭제                     |

---

### ✅ 특징

- 모든 인증 필요한 API는 **Authorization: Bearer TOKEN** 헤더 사용
- 멘션(`@username`) 기능 지원: Post/Comment/Message 작성 시 자동으로 User ObjectId로 변환
- 권한 제어:

  - 작성자만 수정/삭제 가능
  - 멘션된 사용자도 글/댓글/카테고리 열람 가능
  - 메시지 멘션 시 채팅방 자동 초대

## 🔑 API 예시

### Auth

```http
POST /v1/auth/login
{
  "username": "author",
  "password": "pass123"
}
→ 200 OK
{
  "token": "JWT_TOKEN"
}
```

### Posts

```http
POST /v1/posts (Authorization: Bearer TOKEN)
{
  "title": "테스트 글",
  "content": "본문 @target",
  "category": "공지사항"
}
→ 201 Created
{
  "_id": "...",
  "title": "테스트 글",
  "mentions": [ { "_id": "...", "username": "target" } ]
}
```

### ChatRooms

```http
POST /v1/chat-rooms (Authorization: Bearer TOKEN)
{
  "name": "테스트 채팅방",
  "participants": ["<user1Id>", "<user2Id>"]
}
→ 201 Created
```

---

## 🧪 테스트

E2E 테스트는 **MongoMemoryServer** 를 사용해 실제 DB 없이 검증합니다.

실행:

```bash
npm test
```

주요 시나리오:

- 회원가입 / 로그인
- 게시글 생성 / 권한 없는 접근 차단
- 댓글 작성 / 수정 / 삭제
- 카테고리 수정 권한 (작성자 & 멘션된 사용자만 가능)
- 채팅방/메시지 CRUD
