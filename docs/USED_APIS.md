# API Used By Frontend

Tai lieu nay liet ke cac REST API va WebSocket/STOMP endpoint dang duoc frontend su dung trong source code.

Nguon tham chieu chinh:

- `src/apis/user.api.jsx`
- `src/apis/friendship.api.jsx`
- `src/apis/conversation.api.jsx`
- `src/apis/message.api.jsx`
- `src/apis/websocket.api.jsx`
- `src/helpers/token.helper.js`

## Base URL

Frontend tao API base URL tu bien moi truong:

```text
VITE_HOST_URL=http://localhost:8080
```

Base URL day du:

```text
{VITE_HOST_URL}/api/v1
```

Neu khong co `VITE_HOST_URL`, frontend dung mac dinh:

```text
http://localhost:8080/api/v1
```

## Authentication

Cac API can dang nhap gui JWT access token trong header:

```http
Authorization: Bearer <access_token>
```

Khi request tra `401`, frontend goi refresh token:

```http
POST /auth/refresh
```

Sau do lap lai request ban dau voi access token moi.

## Auth APIs

| Method | Endpoint | Muc dich |
| --- | --- | --- |
| `POST` | `/auth/register` | Dang ky tai khoan |
| `POST` | `/auth/login` | Dang nhap va lay token |
| `POST` | `/auth/refresh` | Cap lai access token |
| `POST` | `/auth/logout` | Dang xuat |
| `POST` | `/auth/forgot-password` | Gui OTP quen mat khau |
| `POST` | `/auth/verify-reset-otp` | Xac thuc OTP dat lai mat khau |
| `POST` | `/auth/reset-password` | Dat lai mat khau |

## User APIs

| Method | Endpoint | Muc dich |
| --- | --- | --- |
| `GET` | `/users/me` | Lay profile cua user dang dang nhap |
| `DELETE` | `/users/me` | Xoa tai khoan cua user dang dang nhap |
| `GET` | `/users/search?keyword={keyword}` | Tim user de gui loi moi ket ban |
| `GET` | `/users/search-by-email?email={email}` | Tim user theo email |
| `PATCH` | `/users/profile` | Cap nhat thong tin ca nhan |
| `POST` | `/users/profile/avatar` | Upload avatar |
| `POST` | `/users/profile/background` | Upload anh nen |
| `PATCH` | `/users/settings` | Cap nhat cai dat user |
| `POST` | `/users/me/change-password` | Doi mat khau |

## Friendship APIs

| Method | Endpoint | Muc dich |
| --- | --- | --- |
| `POST` | `/friendships/requests/{userId}` | Gui loi moi ket ban |
| `POST` | `/friendships/{friendshipId}/accept` | Chap nhan loi moi |
| `POST` | `/friendships/{friendshipId}/decline` | Tu choi loi moi |
| `DELETE` | `/friendships/requests/{friendshipId}` | Thu hoi loi moi da gui |
| `DELETE` | `/friendships/{friendshipId}` | Xoa ban |
| `POST` | `/friendships/blocks/{userId}` | Chan user |
| `DELETE` | `/friendships/blocks/{userId}` | Bo chan user |
| `GET` | `/friendships/blocks` | Lay danh sach user da chan |
| `GET` | `/friendships/requests/incoming` | Lay loi moi ket ban da nhan |
| `GET` | `/friendships/requests/outgoing` | Lay loi moi ket ban da gui |
| `GET` | `/friendships` | Lay danh sach ban be |
| `GET` | `/friendships/search?name={name}` | Tim trong danh sach ban be |

## Conversation APIs

| Method | Endpoint | Muc dich |
| --- | --- | --- |
| `GET` | `/conversations/me` | Lay danh sach hoi thoai cua user |
| `POST` | `/conversations` | Tao hoi thoai |
| `GET` | `/conversations/{conversationId}/info` | Lay thong tin hoi thoai |
| `POST` | `/conversations/{conversationId}/members` | Them thanh vien vao nhom |
| `DELETE` | `/conversations/{conversationId}/members/me` | Roi nhom |
| `DELETE` | `/conversations/{conversationId}/members/{memberId}` | Xoa thanh vien khoi nhom |
| `PATCH` | `/conversations/{conversationId}/owner/{memberId}` | Chuyen truong nhom |
| `PATCH` | `/conversations/{conversationId}/members/{memberId}/nickname` | Cap nhat biet danh thanh vien |
| `PATCH` | `/conversations/{conversationId}/emoji` | Cap nhat emoji hoi thoai |
| `PATCH` | `/conversations/{conversationId}/mute` | Tat thong bao hoi thoai |
| `DELETE` | `/conversations/{conversationId}/mute` | Bat lai thong bao hoi thoai |
| `DELETE` | `/conversations/{conversationId}` | Xoa hoi thoai |
| `DELETE` | `/conversations/{conversationId}/me` | Xoa hoi thoai phia user hien tai |
| `POST` | `/conversations/{conversationId}/avatar` | Upload avatar nhom |

## Message APIs

| Method | Endpoint | Muc dich |
| --- | --- | --- |
| `POST` | `/messages` | Gui tin nhan kem file |
| `GET` | `/messages/conversation/{conversationId}/paged?page={page}&size={size}` | Lay tin nhan theo trang |
| `GET` | `/messages/conversation/{conversationId}/search?keyword={keyword}&page={page}&size={size}` | Tim tin nhan trong hoi thoai |
| `PUT` | `/messages/conversation/{conversationId}/read-all` | Danh dau tat ca tin nhan trong hoi thoai la da doc |
| `PUT` | `/messages/{messageId}/read` | Danh dau mot tin nhan la da doc |
| `GET` | `/messages/conversation/{conversationId}/unread-count` | Lay so tin nhan chua doc |
| `GET` | `/messages/conversation/{conversationId}/latest` | Lay tin nhan moi nhat |
| `GET` | `/messages/conversation/{conversationId}/pinned` | Lay danh sach tin nhan da ghim |
| `PUT` | `/messages/{messageId}/pin` | Ghim tin nhan |
| `DELETE` | `/messages/{messageId}/pin` | Bo ghim tin nhan |
| `PUT` | `/messages/{messageId}/recall` | Thu hoi tin nhan |
| `DELETE` | `/messages/{messageId}` | Xoa tin nhan phia user hien tai |
| `GET` | `/messages/conversation/{conversationId}/media/images/preview?limit={limit}` | Lay preview anh trong hoi thoai |
| `GET` | `/messages/conversation/{conversationId}/media/images?page={page}&size={size}` | Lay danh sach anh trong hoi thoai |
| `GET` | `/messages/conversation/{conversationId}/media/files?page={page}&size={size}` | Lay danh sach file trong hoi thoai |
| `GET` | `/messages/conversation/{conversationId}/media/links?page={page}&size={size}` | Lay danh sach link trong hoi thoai |

## WebSocket/STOMP

SockJS connect URL:

```text
{VITE_HOST_URL}/api/v1/ws
```

Khi connect, frontend gui native STOMP header:

```http
Authorization: Bearer <access_token>
```

### Client Publish Destinations

| Destination | Muc dich |
| --- | --- |
| `/app/chat/{conversationId}` | Gui tin nhan text |
| `/app/chat/{conversationId}/read` | Gui trang thai da doc |
| `/app/chat/{conversationId}/typing` | Gui trang thai dang nhap |

### Client Subscribe Destinations

| Destination | Muc dich |
| --- | --- |
| `/topic/conversation/{conversationId}` | Nhan tin nhan realtime trong hoi thoai |
| `/topic/conversation/{conversationId}/read` | Nhan event da doc |
| `/user/queue/conversations` | Nhan update danh sach hoi thoai rieng theo user |
| `/topic/presence` | Nhan trang thai online/offline |

## Ghi Chu

- Cac endpoint REST trong tai lieu nay la endpoint frontend dang goi thuc te, khong phai toan bo API backend co san.
- Cac request upload dung `multipart/form-data`.
- Cac API auth cong khai gom: register, login, forgot password, verify reset OTP, reset password, refresh token.
- Phan lon API con lai can access token hop le.
