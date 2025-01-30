# 📌 INVITRIOO API Documentation

## 🚀 Overview

INVITRIOO is an event management API that allows users to create, manage, and RSVP for events. This API includes **authentication, event management, RSVP handling, and profile settings.**

- **Base URL:** `https://jobbertrack.onrender.com`
- **Authentication:** Bearer Token required for protected routes
- **Response Format:** JSON
- **Tech Stack:** Node.js, Express.js, TypeScript, Mongoose (MongoDB)

---

## 🛠️ Setup & Installation

### **📌 Prerequisites**

Ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **MongoDB** (Local or cloud database like MongoDB Atlas)

### **📌 Install Dependencies**

```sh
npm install
```

### **📌 Start the Application**

```sh
npm start
```

---

## 🔐 Authentication

### **1️⃣ User Signup**

**Endpoint:** `POST /auth/signup`

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "yourpassword",
	"firstname": "John",
	"lastname": "Doe"
}
```

**Response:**

```json
{
	"message": "Signup successful",
	"user": {
		"id": "userId",
		"email": "user@example.com"
	}
}
```

---

### **2️⃣ User Login**

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "yourpassword"
}
```

**Response:**

```json
{
	"message": "Login Successful",
	"token": "your-jwt-token"
}
```

📌 **Use the token in the Authorization header:**

```
Authorization: Bearer your-jwt-token
```

---

## 🎉 Event Management

### **3️⃣ Create Event**

**Endpoint:** `POST /api/events`

**Headers:** `Authorization: Bearer token`

**Request Body (multipart/form-data):**

```json
{
	"title": "Tech Conference 2026",
	"description": "A conference on the latest tech trends",
	"date": "2025-01-10",
	"time": "09:00",
	"duration": "3h",
	"location": "Silicon Valley, CA",
	"image": "file"
}
```

**Response:**

```json
{
	"message": "Event created successfully",
	"event": {
		"id": "eventId",
		"title": "Tech Conference 2026"
	}
}
```

---

### **4️⃣ Get My Events**

**Endpoint:** `GET /api/events`

**Headers:** `Authorization: Bearer token`

**Response:**

```json
{
	"message": "success",
	"events": [
		{
			"id": "eventId",
			"title": "Tech Conference 2026"
		}
	]
}
```

---

### **5️⃣ Get Event by ID**

**Endpoint:** `GET /api/events/{eventId}`

**Response:**

```json
{
	"message": "success",
	"event": {
		"id": "eventId",
		"title": "Tech Conference 2026"
	}
}
```

---

## 🚀 API Demo & Testing

✅ **Test API using Postman** by importing this documentation as a Postman Collection.  
✅ **Use Swagger UI** (`/api-docs`) for an interactive API reference.

📌 **Contact:** [support@invitri.io](mailto:support@invitri.io)  
📌 **Version:** 1.0.0  
📌 **Last Updated:** January 2025
