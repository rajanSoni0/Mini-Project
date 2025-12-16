# CompanionBot - Mental Health Support Chatbot

An intelligent, empathetic AI-powered chatbot designed to provide accessible mental health guidance and support. Built as a 9-credit academic project focusing on practical implementation over custom model training.

## 🌟 Features

### Core Functionality
- **Empathetic AI Chatbot**: Powered by OpenAI GPT-5.1 for contextually aware, emotionally intelligent responses
- **Real-time Sentiment Analysis**: Uses pre-trained DistilBERT model to detect user emotions (Positive, Negative, Neutral)
- **Privacy-First Design**: 
  - Only username and hashed passwords stored
  - No personal identifiers (name, email, phone) collected
  - Secure JWT-based authentication
  - Anonymous chat history storage

### Interactive Features
- **Stress Relief Activities**: Automatically suggested when negative sentiment is detected
  - Guided Breathing Exercise (4-second breathing cycles)
  - Mindfulness Prompts
  - Positive Affirmations
  - Mood Tracker
- **Chat History**: Persistent conversation history for continuous support
- **24/7 Accessibility**: Always available, no appointment needed
- **Responsive UI**: Clean, modern interface with calming gradient design

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 19 + Tailwind CSS | Responsive chat interface |
| **Backend** | FastAPI (Python) | API endpoints, authentication, AI integration |
| **Database** | MongoDB | User accounts and chat history |
| **AI - Conversation** | OpenAI GPT-5.1 (via Emergent LLM key) | Empathetic responses |
| **AI - Sentiment** | DistilBERT (Hugging Face) | Real-time emotion detection |
| **Authentication** | JWT + bcrypt | Secure user sessions |
| **Deployment** | Supervisor + Nginx | Service management |

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+ and Yarn
- MongoDB (running on localhost:27017)
- Emergent LLM Key (provided)

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
cd /app/backend

# Install dependencies
pip install -r requirements.txt

# Environment variables are already configured in .env:
# - MONGO_URL: MongoDB connection
# - DB_NAME: Database name
# - EMERGENT_LLM_KEY: AI integration key
# - JWT_SECRET: Session security

# Start backend (handled by supervisor)
sudo supervisorctl restart backend
```

### 2. Frontend Setup

```bash
cd /app/frontend

# Install dependencies
yarn install

# Environment variables in .env:
# - REACT_APP_BACKEND_URL: Backend API URL

# Start frontend (handled by supervisor)
sudo supervisorctl restart frontend
```

### 3. Service Management

```bash
# Check status
sudo supervisorctl status

# Restart all services
sudo supervisorctl restart all

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log
```

## 📖 API Documentation

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure123"
}

Response:
{
  "token": "eyJhbGciOiJIUz...",
  "username": "johndoe"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure123"
}

Response:
{
  "token": "eyJhbGciOiJIUz...",
  "username": "johndoe"
}
```

### Chat

#### Send Message
```bash
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I am feeling anxious today"
}

Response:
{
  "id": "uuid",
  "user_message": "I am feeling anxious today",
  "bot_response": "I understand that anxiety can be overwhelming...",
  "sentiment": "NEGATIVE",
  "sentiment_score": 0.95,
  "timestamp": "2025-12-16T03:44:24Z"
}
```

#### Get Chat History
```bash
GET /api/chat/history?limit=50
Authorization: Bearer <token>

Response: Array of chat messages
```

#### Clear Chat History
```bash
DELETE /api/chat/clear
Authorization: Bearer <token>

Response:
{
  "message": "Cleared 10 messages"
}
```

## 🎨 Frontend Components

### Pages
- **LoginPage**: Authentication (Login/Register with tab switcher)
- **ChatPage**: Main chat interface with sentiment indicators
- **StressReliefModal**: Interactive stress management activities

### Key Features
- Real-time chat updates
- Sentiment-based message styling
- Typing indicators
- Smooth animations
- Responsive design (mobile-friendly)
- Accessibility features (data-testid attributes)

## 🔒 Security Features

1. **Password Security**: bcrypt hashing with salt
2. **JWT Authentication**: 24-hour token expiration
3. **No Personal Data**: Only username stored
4. **CORS Protection**: Configured for secure origins
5. **Input Validation**: Pydantic models for API requests

## 🧪 Testing

### Backend Testing
```bash
# Test registration
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Test chat
curl -X POST http://localhost:8001/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"message":"I feel great today!"}'
```

### Frontend Testing
Access the application at: https://budget-credits.preview.emergentagent.com

## 📊 Project Scope (9 Credits)

### What's Included ✅
- Functional chatbot with AI responses
- Sentiment analysis
- User authentication
- Chat history
- Stress relief activities
- Privacy-first architecture
- Responsive UI

### Simplified from Original Spec
- **Original**: Custom-trained transformer models on multiple datasets
- **Current**: Pre-trained DistilBERT + OpenAI API (more practical for academic scope)

- **Original**: Full Phaser.js game development
- **Current**: CSS/JS-based interactive activities (achieves same stress-relief goal)

### Future Enhancements (Beyond 9 Credits)
- Multilingual support
- Voice interaction
- Integration with licensed counselors
- Mobile app (React Native)
- Advanced analytics dashboard

## 🎓 Academic Context

This project is designed for a **9-credit semester course** focusing on:
1. Full-stack web development
2. AI/ML integration (using pre-trained models)
3. User authentication and security
4. Database design and management
5. API development
6. UI/UX design principles
7. Privacy-preserving architecture

**Why not custom model training?**
Training custom transformers on large datasets (GoEmotions, DailyDialog, EmpatheticDialogues) requires:
- Significant computational resources (GPUs)
- Weeks of training time
- Advanced ML expertise
- Large storage for datasets and models

For a 9-credit project, using production-ready pre-trained models demonstrates practical engineering skills while maintaining project feasibility.

## 📝 Credits & Acknowledgments

**Project by:**
- Rajan Soni (2300970100155)
- Saksham Singh (2300970100165)
- Raj Wardhan Singh (2300970100154)

**Supervisor:** Ms. Ritu Dewan  
**Institution:** Galgotias College of Engineering & Technology  
**Department:** CSE Department

**Technologies Used:**
- OpenAI GPT-5.1 (via Emergent LLM Key)
- Hugging Face Transformers
- FastAPI Framework
- React Library
- MongoDB Database

## 📞 Support

For issues or questions:
1. Check API logs: `tail -f /var/log/supervisor/backend.*.log`
2. Check frontend logs: `tail -f /var/log/supervisor/frontend.*.log`
3. Verify services: `sudo supervisorctl status`

## 🏁 Getting Started

1. Services should already be running
2. Access the application at: https://budget-credits.preview.emergentagent.com
3. Create an account (register)
4. Start chatting!
5. When negative sentiment is detected, try the stress relief activities

---

**Note**: This project prioritizes practical implementation and user privacy over research-level AI development, making it ideal for an academic semester project while remaining fully functional and valuable for mental health support.
