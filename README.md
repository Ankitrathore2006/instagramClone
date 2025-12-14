# 📸 Social Media App (Instagram Clone)

A **full-stack Instagram-like social media application** built using the **MERN Stack**.  
This project supports **user authentication, posts, likes, comments, follow/unfollow, profiles, search, suggestions, and notifications**.

---

## 🚀 Features

### 🔐 Authentication
- User signup & login (JWT based)
- Protected routes
- Secure password hashing

### 👤 User Profile
- View own & other users’ profiles
- Profile photo upload
- Followers & following lists
- Follow / Unfollow users

### 💬 Real-time Chat
- Messaging between users
- View message history
- Real-time notifications for new messages

### 🖼️ Posts
- Create posts with images
- View feed posts
- View user posts
- Like & unlike posts
- Comment on posts
- Randomized feed support

### 🔍 Search & Suggestions
- Search users by **username or full name**
- Suggested users (not followed)
- View profiles from search

### 🔔 Notifications *(optional / extendable)*
- Follow notifications
- Like & comment notifications

### ⚡ UI / UX
- Responsive design
- Instagram-like layout
- Modal post view
- Optimistic UI updates

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Zustand (State Management)
- Axios
- Tailwind CSS
- Lucide Icons
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary / Base64 Image Upload

---

## 📁 Project Structure

├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middleware
│ └── server.js
│
├── frontend
│ ├── components
│ ├── pages
│ ├── store
│ ├── lib
│ └── App.jsx
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ankitrathore2006/instagramClone.git
cd instagramClone

```

2️⃣ Backend Setup
```
cd backend
npm install
```

Create a .env file:
```
PORT=5001
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name


```

Start backend server:
```
npm run dev
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

Backend runs on:
```
http://localhost:5001
```

## 🔗 API Endpoints (Sample)

### 🔐 Auth
- **POST** `/api/auth/register`
- **POST** `/api/auth/login`
- **GET** `/api/auth/user/:id`

### 📝 Posts
- **POST** `/api/posts`
- **GET** `/api/posts/feed`
- **GET** `/api/posts/user/:id`

### 👥 Follow System
- **PUT** `/api/auth/follow/:id`
- **PUT** `/api/auth/unfollow/:id`

### 🔍 Search
- **GET** `/api/auth/SearchUser?query=xyz`

---

## 🧠 Learning Outcomes

- Implemented **JWT authentication**
- Designed **RESTful APIs**
- Used **Zustand** for global state management
- Built **Instagram-like follow/unfollow logic**
- Handled **modals & optimistic UI updates**
- Improved **MongoDB query optimization**

---

## 🚧 Future Enhancements

- Real-time chat using **Socket.IO**
- Story feature
- Notifications system
- Reels / video posts
- Saved posts functionality
- Dark mode toggle


---

## 👨‍💻 Developed By

**Ankit Rathore**  
🎓 B.Tech Computer Science Student  
🏫 Medi-Caps University  

📧 **College Email:** en23cs3l1004@medicaps.ac.in  
📧 **Personal Email:** ankitrathore4310@gmail.com  

--

