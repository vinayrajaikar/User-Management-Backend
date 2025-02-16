# User-Management-Backend
The **User Management API** is a **RESTful API** built with **Node.js, Express, and MongoDB** to handle **user authentication, authorization, and CRUD operations**. It provides **secure user management with JWT-based authentication** and **role-based access control (RBAC)**.

## 📌 Features  
✅ **User Authentication (JWT-Based)**  
✅ **User Registration (Signup & Login)**  
✅ **Protected Routes (Require JWT Token)**  
✅ **User CRUD Operations (Create, Read, Update, Delete)**  
✅ **Role-Based Access Control (Admin Only for Deleting Users)**  
✅ **Input Validation & Error Handling**  

---

##  API Endpoints  

###  **Authentication Routes**  
| Method | Endpoint              | Description |
|--------|----------------------|-------------|
| **POST** | `/api/auth/signup`  | Register a new user. |
| **POST** | `/api/auth/login`   | Login a user and return JWT. |

### 🛡️ **Protected User Routes (Require JWT)**  
| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| **POST**  | `/api/users`         | Create a new user (Admin Only). |
| **GET**   | `/api/users`         | Retrieve all users (Authenticated). |
| **GET**   | `/api/users/:id`     | Get a single user by ID. |
| **PUT**   | `/api/users/:id`     | Update a user’s details. |
| **DELETE** | `/api/users/:id`     | Delete a user (Admin Only). |
