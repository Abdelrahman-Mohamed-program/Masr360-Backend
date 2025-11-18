# 🇪🇬 Discover Egypt API Documentation

REST API for user authentication, Egyptian cities, tourist places, and nightlife events.

---

## 📌 Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Users](#users)
- [Discover Egypt](#discover-egypt)
- [Places](#places)
- [Nights](#nights)
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

## 🔹 POST /auth/signup
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

# Users

## 🔹 GET /users/me  
Requires JWT.

### Response
```json
{
  "id": 32,
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "+20123...",
  "cameFromIP": "156.192.22.14"
}
```

---

# Discover Egypt

## 🔹 GET /discover-egypt  
Returns 27 cities.

### Example Response
```json
[
  {
    "id": 1,
    "name": "Cairo",
    "desc": "Capital of Egypt",
    "places": [
      {
        "id": 10,
        "name": "Egyptian Museum",
        "desc": "Ancient artifacts",
        "ratings": 4.7,
        "reviews": 913,
        "categories": ["Cultural & Heritage Tourism"],
        "subCategories": ["Museums", "Archaeological Sites"]
      }
    ]
  }
]
```

### Query Support
```
?limit=10&page=1
?sort=name
?category=Cultural%20&%20Heritage%20Tourism
?city=Cairo
```

---

# Places

## 🔹 GET /places  
List all places across Egypt.

### Response
```json
[
  {
    "id": 10,
    "name": "Karnak Temple",
    "desc": "Ancient Egyptian temple complex",
    "ratings": 4.9,
    "reviews": 1221,
    "categories": ["Cultural & Heritage Tourism"],
    "subCategories": ["Temples", "Archaeological Sites"]
  }
]
```

---

## 🔹 GET /places/:id  
Get a single place.

### Response
```json
{
  "id": 10,
  "name": "Karnak Temple",
  "desc": "Ancient Egyptian temple complex",
  "categories": ["Cultural & Heritage Tourism"],
  "subCategories": ["Temples"]
}
```

### Error
- 404 — Place not found  

---

# Nights

## 🔹 GET /nights  
Nightlife events in Egypt.

### Example Response
```json
[
  {
    "id": 5,
    "name": "Cairo Jazz Night",
    "location": "Zamalek",
    "ratings": 4.6,
    "reviews": 320,
    "categories": [
      "Cultural Events & Festivals",
      "Live Music & Concerts",
      "Local Cafés",
      "Restaurants",
      "Night Markets",
      "Traditional Shows (Tanoura, Folk Dance)"
    ]
  }
]
```

### Query Parameters
```
?category=Live%20Music%20&%20Concerts
?sort=ratings
?page=1&limit=10
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
?sort=-ratings  (descending)
```

## Filtering
```
?category=Eco%20&%20Adventure%20Tourism
?city=Giza
?subCategory=Museums
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

---