# 🎓 College Student Connect & Utility Platform - Backend

A complete backend API for a college student platform featuring authentication, lost & found management, and a marketplace system.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Scripts](#scripts)

---

## ✨ Features

### 🔐 Authentication System
- User registration with password hashing
- Login with JWT token generation
- Protected routes with token verification
- Token expiry (30 days)

### 🔍 Lost & Found Management
- Post lost items with details (item name, description, lost date, location, contact)
- Post found items
- View all lost items
- View all found items
- User authentication required for posting

### 🛒 Student Marketplace
- Buy/Sell items with image upload
- Image upload support (JPEG, JPG, PNG, GIF, WEBP)
- File size limit: 5MB
- Category-based filtering (Buy/Sell)
- User authentication required for posting

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **File Upload:** Multer
- **Environment Variables:** dotenv
- **CORS:** cors

---

## 📁 Folder Structure

```
Backend_Connect_Student/
├── src/
│   ├── config/
│   │   └── dbConfig.js              # MongoDB connection
│   ├── models/
│   │   ├── userModel.js             # User schema
│   │   ├── lostItemModel.js         # Lost & Found schema
│   │   └── marketplaceItemModel.js  # Marketplace schema
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login)
│   │   ├── lostFoundController.js   # Lost & Found logic
│   │   └── marketplaceController.js # Marketplace logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth routes
│   │   ├── lostFoundRoutes.js       # Lost & Found routes
│   │   └── marketplaceRoutes.js     # Marketplace routes
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── uploadMiddleware.js      # Multer configuration
│   │   └── validateRequest.js       # Request validation
│   ├── utils/
│   │   └── constants.js             # HTTP status codes
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── uploads/                         # Uploaded images storage
├── .env                             # Environment variables
├── package.json                     # Dependencies
└── README.md                        # Documentation
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Backend_Connect_Student
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
# Create .env file in root directory with following variables
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/student_connect
JWT_SECRET=supersecretkey
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:4000`

---

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/student_connect
JWT_SECRET=supersecretkey
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://127.0.0.1:27017/student_connect |
| `JWT_SECRET` | Secret key for JWT token | supersecretkey |

---

## 📡 API Endpoints

### 🔐 Authentication Routes

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 🔍 Lost & Found Routes

#### Create Lost/Found Item (Protected)
```http
POST /api/lost-found
```
**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "itemName": "Black Laptop",
  "description": "Dell Inspiron 15, Black color",
  "lostDate": "2026-01-05",
  "location": "Library 2nd Floor",
  "contactNumber": "9876543210",
  "type": "lost"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item posted successfully",
  "data": {
    "_id": "...",
    "itemName": "Black Laptop",
    "description": "Dell Inspiron 15, Black color",
    "lostDate": "2026-01-05T00:00:00.000Z",
    "location": "Library 2nd Floor",
    "contactNumber": "9876543210",
    "type": "lost",
    "createdBy": "...",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T10:30:00.000Z"
  }
}
```

#### Get All Lost Items
```http
GET /api/lost-found/lost
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "itemName": "Black Laptop",
      "description": "Dell Inspiron 15",
      "lostDate": "2026-01-05T00:00:00.000Z",
      "location": "Library",
      "contactNumber": "9876543210",
      "type": "lost",
      "createdBy": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-06T10:30:00.000Z"
    }
  ]
}
```

#### Get All Found Items
```http
GET /api/lost-found/found
```

---

### 🛒 Marketplace Routes

#### Create Marketplace Item (Protected)
```http
POST /api/marketplace
```
**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
itemName: Engineering Textbook
description: Computer Science 3rd Edition
price: 500
sellerName: John Doe
category: sell
image: [Upload Image File]
```

**Response:**
```json
{
  "success": true,
  "message": "Item posted successfully",
  "data": {
    "_id": "...",
    "itemName": "Engineering Textbook",
    "description": "Computer Science 3rd Edition",
    "price": 500,
    "sellerName": "John Doe",
    "category": "sell",
    "image": "uploads/image-1736158200000-123456789.jpg",
    "createdBy": "...",
    "createdAt": "2026-01-06T10:30:00.000Z"
  }
}
```

#### Get All Buy Items
```http
GET /api/marketplace/buy
```

#### Get All Sell Items
```http
GET /api/marketplace/sell
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "itemName": "Engineering Textbook",
      "description": "Computer Science 3rd Edition",
      "price": 500,
      "sellerName": "John Doe",
      "category": "sell",
      "image": "uploads/image-1736158200000-123456789.jpg",
      "createdBy": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-06T10:30:00.000Z"
    }
  ]
}
```

---

## 💡 Usage Examples

### Using cURL

#### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

#### Create Lost Item (Protected)
```bash
curl -X POST http://localhost:4000/api/lost-found \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "itemName": "Laptop",
    "description": "Black Dell laptop",
    "lostDate": "2026-01-05",
    "location": "Library",
    "contactNumber": "9876543210",
    "type": "lost"
  }'
```

#### Upload Marketplace Item with Image
```bash
curl -X POST http://localhost:4000/api/marketplace \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "itemName=Textbook" \
  -F "description=Engineering book" \
  -F "price=500" \
  -F "sellerName=John" \
  -F "category=sell" \
  -F "image=@/path/to/image.jpg"
```

### Using Postman

1. **Register/Login:**
   - Method: POST
   - URL: `http://localhost:4000/api/auth/register` or `/login`
   - Body: raw JSON

2. **Protected Routes:**
   - Add Header: `Authorization: Bearer <your_token>`

3. **Image Upload:**
   - Body: form-data
   - Add fields and select file for `image` field

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  timestamps: true
}
```

### Lost Item Model
```javascript
{
  itemName: String (required),
  description: String (required),
  lostDate: Date (required),
  location: String,
  contactNumber: String (required),
  type: String (enum: ['lost', 'found']),
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Marketplace Item Model
```javascript
{
  itemName: String (required),
  description: String,
  price: Number (required, min: 0),
  sellerName: String (required),
  category: String (enum: ['buy', 'sell']),
  image: String (file path),
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

---

## 🔒 Middleware

### authMiddleware
- Verifies JWT token from Authorization header
- Extracts user from token
- Adds user to request object

### uploadMiddleware
- Multer configuration for image uploads
- File size limit: 5MB
- Allowed formats: jpeg, jpg, png, gif, webp
- Storage: local `uploads/` folder

### validateRequest
- Validates required fields in request body
- Returns error if fields are missing

---

## 📜 Scripts

```json
{
  "start": "node src/server.js",       // Production mode
  "dev": "nodemon src/server.js",      // Development mode
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

**Run Development Server:**
```bash
npm run dev
```

**Run Production Server:**
```bash
npm start
```

---

## 🔧 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (in development)"
}
```

**HTTP Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

1. **Authentication Required:**
   - All POST routes for lost-found and marketplace require authentication
   - Include `Authorization: Bearer <token>` header

2. **Image Upload:**
   - Use `multipart/form-data` content type
   - Field name must be `image`
   - Access uploaded images at `/uploads/{filename}`

3. **Token Management:**
   - Tokens expire in 30 days
   - Store token securely on client side
   - Include in Authorization header for protected routes

4. **Password Security:**
   - Passwords are hashed using bcryptjs before storage
   - Never stored in plain text

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**ARYAN KUMAR**

---

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All open-source contributors

---

**Happy Coding! 🚀**
