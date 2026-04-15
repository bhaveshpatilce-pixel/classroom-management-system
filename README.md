# 📚 Classroom Lite

> A lightweight Learning Management System (LMS) for teachers and students — built with Node.js, Express, and MongoDB.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-5865F2?style=for-the-badge&logo=railway)](https://classroom-management-system-production-99c7.up.railway.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-63%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/bhaveshpatilce-pixel/classroom-management-system)
[![CSS](https://img.shields.io/badge/CSS-21.7%25-1572B6?style=for-the-badge&logo=css3)](https://github.com/bhaveshpatilce-pixel/classroom-management-system)
[![HTML](https://img.shields.io/badge/HTML-15.3%25-E34F26?style=for-the-badge&logo=html5)](https://github.com/bhaveshpatilce-pixel/classroom-management-system)

---

## 🌐 Live Demo

👉 [https://classroom-management-system-production-99c7.up.railway.app/](https://classroom-management-system-production-99c7.up.railway.app/)

---

## 🧩 Features

### 👨‍🏫 Teacher Role
- Create and manage courses
- Post announcements to students
- Add assignments with deadlines and total marks
- View and grade student submissions
- Export all submissions as CSV

### 👨‍🎓 Student Role
- Join courses using a unique course code
- Browse course announcements and assignments
- Submit assignments
- View grades and teacher feedback
- Track enrolled courses from a personal dashboard

### 🔐 Auth & General
- JWT-based authentication
- Dual-role registration (Teacher / Student)
- Dark mode toggle
- Responsive single-page layout

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | HTML, CSS, Vanilla JavaScript  |
| Backend    | Node.js, Express.js            |
| Database   | MongoDB (Mongoose ODM)         |
| Auth       | JSON Web Tokens (JWT)          |
| Deployment | Railway                        |

---

## 📁 Project Structure

```
classroom-management-system/
├── backend/          # Express route handlers & controllers
├── config/           # Database and environment config
├── middleware/       # Auth middleware (JWT verification)
├── models/           # Mongoose schemas (User, Course, Assignment, etc.)
├── routes/           # API route definitions
├── public/           # Frontend (HTML, CSS, JS)
├── server.js         # App entry point
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/bhaveshpatilce-pixel/classroom-management-system.git
cd classroom-management-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start the server
npm start
```

The app will be running at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 📸 Screenshots

| Teacher Dashboard | Student Dashboard |
|:-----------------:|:-----------------:|
| Courses · Submissions · Pending Grading | Enrolled Courses · Grades · Profile |

---

## 👥 Contributors

- [NikhilGade07](https://github.com/NikhilGade07) — Nikhil Gade  
- [bhaveshpatilce-pixel](https://github.com/bhaveshpatilce-pixel) — Bhavesh Patil  
- [akshatathiglece-eng](https://github.com/akshatathiglece-eng) — Akshata Thigle  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by the Classroom Lite team</p>
