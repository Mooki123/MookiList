# Anime Watchlist - MERN Stack Application

A full-stack anime watchlist application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring AI-powered recommendations, real-time search, and user authentication.

![Anime Watchlist](https://img.shields.io/badge/MERN-Stack-orange)
![React](https://img.shields.io/badge/React-18.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)

## Features

### Core Functionality

- **User Authentication**: Secure JWT-based login/registration system
- **Anime Search & Discovery**: Real-time search using Jikan API (MyAnimeList)
- **Personalized Watchlist**: Add, remove, and track anime with custom status and ratings
- **AI-Powered Recommendations**: Google Gemini API integration for personalized suggestions

### Advanced Features

- **Interactive Anime Details**: Comprehensive information with trailer integration
- **Real-time Comments System**: User-generated content with authentication
- **Responsive Design**: Modern, mobile-first UI with Tailwind CSS
- **Advanced Filtering**: Search by genre, type, status, and more
- **RESTful API Architecture**: Well-structured backend with proper error handling

## Tech Stack

### Frontend

- **React.js** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications
- **Vite** - Build tool and dev server

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Gemini AI** - AI recommendations

### APIs

- **Jikan API** - MyAnimeList data
- **Google Gemini API** - AI-powered recommendations

## Screenshots

### Homepage & Search

![Homepage](screenshots/homepage.png)
_Modern homepage with search functionality_

### Anime Details

![Anime Details](screenshots/anime-details.png)
_Comprehensive anime information with comments_

### Watchlist

![Watchlist](screenshots/watchlist.png)
_Personal anime tracking system_

### Recommendations

![Recommendations](screenshots/recommendations.png)
_AI-powered personalized suggestions_

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key
- Jikan API (free, no key required)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/anime-watchlist.git
   cd anime-watchlist
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:

   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=8080
   ```

4. **Start the application**

   ```bash
   # Start backend server (from backend directory)
   cd backend
   npm start

   # Start frontend development server (from frontend directory)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## Project Structure

```
anime-watchlist/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── watchlistController.js # Watchlist management
│   │   └── commentController.js  # Comments system
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Anime.js             # Anime schema
│   │   └── Comment.js           # Comment schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── watchlistRoutes.js   # Watchlist routes
│   │   └── commentRoutes.js     # Comment routes
│   ├── services/
│   │   └── geminiService.js     # AI recommendation service
│   └── server.js                # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── SearchAnime.jsx  # Search functionality
│   │   │   └── SearchFilters.jsx # Advanced filters
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Search.jsx       # Search page
│   │   │   ├── AnimeDetails.jsx # Anime details page
│   │   │   ├── Watchlist.jsx    # Watchlist page
│   │   │   └── Recommendations.jsx # AI recommendations
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   └── services/
│   │       ├── axios.js         # API configuration
│   │       └── jikan.js         # Jikan API service
│   └── index.html
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Watchlist

- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add anime to watchlist
- `PUT /api/watchlist/:id` - Update anime status/rating
- `DELETE /api/watchlist/:id` - Remove anime from watchlist
- `GET /api/watchlist/recommendations` - Get AI recommendations

### Comments

- `GET /api/comments/:animeId` - Get comments for anime
- `POST /api/comments/:animeId` - Add comment (authenticated)

## Key Features Explained

### AI-Powered Recommendations

The application analyzes your watchlist using Google Gemini AI to provide personalized anime suggestions based on your viewing preferences, genres, and ratings.

### Real-time Search

Powered by Jikan API, the search functionality provides instant results with advanced filtering options including genre, type, status, and rating filters.

### User Authentication

Secure JWT-based authentication system with password hashing and protected routes for user-specific features.

### Responsive Design

Modern, mobile-first design using Tailwind CSS with smooth animations and intuitive user interface.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jikan API](https://jikan.moe/) - MyAnimeList API wrapper
- [Google Gemini AI](https://ai.google.dev/) - AI recommendation engine
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - Frontend library

## Contact

Lakshay Saharan- [LinkedIn](https://www.linkedin.com/in/lakshay-saharan-30b904287/) - lakshaysaharan769@gmail.com

My github: https://github.com/Mooki123

---

Star this repository if you found it helpful!
