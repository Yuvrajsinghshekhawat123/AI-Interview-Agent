# AI-Interview-Agent


# AI Interview Agent

AI Interview Agent is a full-stack MERN application that helps users practice job interviews with AI-generated questions, resume-based personalization, answer evaluation, interview reports, history tracking, and a credit-based payment system.

## Features

- Firebase Google authentication with JWT cookie sessions
- Resume PDF upload and AI-based resume analysis
- HR and technical interview modes
- AI-generated interview questions based on role, experience, skills, projects, and resume content
- Difficulty progression across questions: easy, medium, and hard
- Timer-based interview questions
- AI answer evaluation with confidence, communication, correctness/relevance, score, and feedback
- Final interview report with question-wise scores and skill analytics
- Interview history with detailed previous interview records
- Credit system for unlocking interview sessions
- Razorpay payment integration
- Retry-aware API client for better frontend network handling
- Docker support for frontend and backend deployment

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- React Query
- Axios
- Tailwind CSS
- Framer Motion
- Recharts
- Firebase Authentication

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Admin SDK
- JWT
- Argon2
- Multer
- PDF parsing
- OpenRouter/OpenAI SDK
- Razorpay

## Project Structure

```text
AI-Interview-Agent/
|-- Frontend/
|   |-- src/
|   |   |-- 00-app/
|   |   |-- 01-api/
|   |   |-- 02-Components/
|   |   |-- 03-features/
|   |   |-- 04-layout/
|   |   `-- 05-pages/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
|-- Server/
|   |-- src/
|   |   |-- 01-config/
|   |   |-- 02-models/
|   |   |-- 03-controllers/
|   |   |-- 04-routes/
|   |   |-- 05-middlewares/
|   |   `-- 06-utils/
|   |-- Dockerfile
|   `-- package.json
|-- docker-compose.yml
`-- README.md
```

## How It Works

1. The user signs in with Google through Firebase Authentication.
2. The backend verifies the Firebase token and creates JWT access and refresh cookies.
3. The user selects a role, experience level, and interview mode.
4. The user can upload a resume PDF for AI-based extraction of role, skills, projects, and experience.
5. The backend sends the profile and resume context to the AI model.
6. The AI generates five interview questions with increasing difficulty.
7. The user submits answers for each question.
8. The AI evaluates each answer and returns scores and feedback.
9. The final report shows overall score, skill-wise performance, and question-wise feedback.
10. The user can view interview history and purchase credits using Razorpay.

## API Routes

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/user/auth/login` | Login using Firebase token |
| GET | `/api/user/userDetails` | Get logged-in user details |
| POST | `/api/user/logout` | Logout user |
| POST | `/api/user/analyze-resume` | Upload and analyze resume PDF |

### Interview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/user/interview/generate-questions` | Generate AI interview questions |
| POST | `/api/user/interview/submit-answers` | Submit and evaluate an answer |
| POST | `/api/user/interview/finish-interview` | Generate final interview report |
| GET | `/api/user/interview/interview-history` | Get interview history |

### Payment

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/user/payment/packages` | Get available credit packages |
| POST | `/api/user/payment/create-order` | Create Razorpay order |
| POST | `/api/user/payment/verify-payment` | Verify Razorpay payment |
| GET | `/api/user/payment/balance` | Get user credit balance |
| GET | `/api/user/payment/history` | Get payment history |
| GET | `/api/user/payment/getPurchasedPackages` | Get purchased packages |

## Installation

### Prerequisites

- Node.js
- npm
- MongoDB database
- Firebase project
- OpenRouter API key
- Razorpay account

### Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Interview-Agent
```

### Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` folder:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
COOKIE_SECURE=false

OPENROUTER_API_KEY=your_openrouter_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Firebase Admin SDK is used on the backend. Add your Firebase service account JSON file in the backend utils folder and update the path in:

```text
Server/src/06-utils/firebaseAdmin.js
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

The backend will run on:

```text
http://localhost:5000
```

## Docker Deployment

The project includes a `docker-compose.yml` file for running frontend and backend containers.

```bash
docker compose up --build
```

Default container setup:

- Frontend: port `80`
- Backend: port `5000`

Before Docker deployment, make sure the backend environment variables are configured in `Server/.env`, and the frontend build arguments are available.

## Main Interview Flow

```text
Login
  -> Select role, experience, and mode
  -> Optional resume upload
  -> Generate AI questions
  -> Answer timed questions
  -> Submit answers for AI evaluation
  -> Generate final report
  -> View analytics and history
```

## AI Evaluation

Each submitted answer is evaluated using:

- Confidence
- Communication
- Correctness or relevance
- Final score
- Short improvement feedback

The final report averages the question scores and shows a detailed question-wise breakdown.

## Credits System

Users need credits to generate interview questions. The backend checks the user's balance before creating an interview session. Payments are handled using Razorpay, and successful payments increase the user's credit balance.

## Future Improvements

- Voice-based answer recording
- Real-time speech-to-text
- Downloadable PDF reports
- More detailed topic-wise analytics
- Admin dashboard for package and user management
- Email-based report sharing

## Author

Developed as a full-stack AI interview preparation project using the MERN stack.
