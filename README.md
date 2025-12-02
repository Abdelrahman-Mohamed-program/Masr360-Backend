# 🇪🇬 Discover Egypt API Documentation

REST API for user authentication, Egyptian governments, tourist places, nightlife events, and products.

---

## 📌 Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Users](#users)
- [Governments](#governments)
- [Places](#places)
- [Nights](#nights)
- [Products](#products)
- [Query Parameters](#query-parameters)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

---

# Base URL
```
https://api.your-domain.com
```

---

# Authentication

## 🔹 POST /auth/register
Register a new user.

### Request
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "123456",
  "phone": "+20123456789"
}
```

### Response
```json
{
  "message": "User created successfully",
  "userId": 32
}
```

### Errors
- 400 — Missing fields  
- 409 — Email already exists  

---

## 🔹 POST /auth/login
Login user & return **JWT + Refresh Token**.

### Request
```json
{
  "email": "ahmed@example.com",
  "password": "123456"
}
```

### Response
```json
{
  "accessToken": "<jwt_here>",
  "refreshToken": "<refresh_here>"
}
```

### Errors
- 400 — Wrong email or password  

---

## 🔹 POST /auth/refresh
Get new access token using refresh token.

### Request
```json
{
  "refreshToken": "<refresh_here>"
}
```

### Response
```json
{
  "accessToken": "<new_jwt_here>"
}
```

---




# Governments

## 🔹 GET /governments  
List all governments.

**Response**
```json
[
  { "id": "1", "name": "Cairo" },
  { "id": "2", "name": "Giza" }
]
```

---

## 🔹 GET /governments/:id  
Get a single government.

**Response**
```json
{
  "id": "1",
  "name": "Cairo"
}
```

**Errors**
- 404 — Government not found  

---

## 🔹 POST /governments
Create a new government.

**Request**
```json
{
  "name": "Luxor"
}
```

**Response**
```json
{
  "message": "Government created successfully",
  "id": "64f9a8b2c5a3e01d3a7f5678"
}
```

---

## 🔹 PUT /governments/:id
Update a government.

**Request**
```json
{
  "name": "Updated Name"
}
```

**Response**
```json
{
  "message": "Government updated successfully"
}
```

---

## 🔹 DELETE /governments/:id
Delete a government.

**Response**
```json
{
  "message": "Government deleted successfully"
}
```

---

# Places

## 🔹 GET /places  
List all places.

**Response**
```json
[
  {
    "id": "10",
    "name": "Karnak Temple",
    "desc": "Ancient Egyptian temple complex",
    "category": "Cultural & Heritage Tourism",
    "subCategory": "Temples",
    "location": "Luxor",
    "locationIframe": "<iframe_here>",
    "government": "64f9a8b2c5a3e01d3a7f5678",
    "reviews": []
  }
]
```

---

## 🔹 GET /places/:id  
Get a single place.

**Response**
```json
{
  "id": "10",
  "name": "Karnak Temple",
  "desc": "Ancient Egyptian temple complex",
  "category": "Cultural & Heritage Tourism",
  "subCategory": "Temples",
  "location": "Luxor",
  "locationIframe": "<iframe_here>",
  "government": "64f9a8b2c5a3e01d3a7f5678",
  "reviews": []
}
```

**Errors**
- 404 — Place not found  

---

# Nights

## 🔹 GET /nights  
List all nightlife events.

**Response**
```json
[
  {
    "id": "5",
    "name": "Cairo Jazz Night",
    "location": "Zamalek",
    "locationIframe": "<iframe_here>",
    "category": "Live Music & Concerts",
    "subCategory": "Jazz Events",
    "reviews": []
  }
]
```

---

# Products

## 🔹 GET /products  
List all products.

**Response**
```json
[
  {
    "id": "21",
    "name": "Egyptian Papyrus",
    "category": "Souvenirs",
    "subCategory": "Arts & Crafts",
    "price": 50,
    "discount": 5,
    "reviews": []
  }
]
```

---

# Query Parameters

## Pagination
```
?page=1&limit=10
```

## Sorting
```
?sort=name
?sort=-price  (descending)
```

## Filtering
```
?category=Souvenirs
?government=Cairo
?subCategory=Temples
```

---

# Error Handling Format

Every error returns:
```json
{
  "error": true,
  "message": "Meaningful error message here"
}
```

---

# Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 500  | Server Error |
