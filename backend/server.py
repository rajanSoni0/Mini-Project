from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from transformers import pipeline
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'companionbot_secret_key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Initialize sentiment analysis model (lightweight)
sentiment_analyzer = None

def get_sentiment_analyzer():
    global sentiment_analyzer
    if sentiment_analyzer is None:
        try:
            sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            sentiment_analyzer = None
    return sentiment_analyzer

# ============= MODELS =============
class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    username: str

class ChatMessageRequest(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: str
    user_message: str
    bot_response: str
    sentiment: str
    sentiment_score: float
    timestamp: datetime

class ChatHistoryItem(BaseModel):
    id: str
    user_message: str
    bot_response: str
    sentiment: str
    sentiment_score: float
    timestamp: datetime

# ============= HELPER FUNCTIONS =============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(username: str) -> str:
    payload = {
        'username': username,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get('username')
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def analyze_sentiment(text: str) -> tuple:
    """Analyze sentiment and return (label, score)"""
    analyzer = get_sentiment_analyzer()
    if analyzer is None:
        # Fallback to simple keyword-based analysis
        negative_words = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'lonely', 'hurt', 'angry', 'stressed']
        positive_words = ['happy', 'good', 'great', 'fine', 'better', 'excited', 'joyful', 'grateful']
        
        text_lower = text.lower()
        neg_count = sum(1 for word in negative_words if word in text_lower)
        pos_count = sum(1 for word in positive_words if word in text_lower)
        
        if neg_count > pos_count:
            return ("NEGATIVE", 0.7)
        elif pos_count > neg_count:
            return ("POSITIVE", 0.7)
        else:
            return ("NEUTRAL", 0.5)
    
    try:
        result = analyzer(text[:512])[0]  # Limit text length
        label = result['label']
        score = result['score']
        return (label, score)
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return ("NEUTRAL", 0.5)

async def get_ai_response(user_message: str, sentiment: str, username: str) -> str:
    """Get empathetic AI response using Emergent LLM"""
    try:
        # Create system message based on sentiment
        if sentiment == "NEGATIVE":
            system_message = """You are CompanionBot, an empathetic mental health support chatbot. 
The user is expressing negative emotions. Respond with warmth, understanding, and supportive guidance.
Be compassionate, validate their feelings, and offer gentle encouragement. Keep responses concise (2-3 sentences).
If they seem in distress, suggest simple coping strategies like breathing exercises or mindfulness."""
        elif sentiment == "POSITIVE":
            system_message = """You are CompanionBot, a supportive mental health chatbot.
The user is expressing positive emotions. Celebrate with them, reinforce their positive mindset, 
and encourage them to maintain their well-being. Keep responses warm and concise (2-3 sentences)."""
        else:
            system_message = """You are CompanionBot, a friendly mental health support chatbot.
Respond with warmth and understanding. Ask thoughtful questions to better understand their state of mind.
Keep responses concise (2-3 sentences)."""
        
        # Initialize chat with Emergent LLM key
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"companion_{username}_{uuid.uuid4()}",
            system_message=system_message
        ).with_model("openai", "gpt-5.1")
        
        # Create user message
        user_msg = UserMessage(text=user_message)
        
        # Get response
        response = await chat.send_message(user_msg)
        return response
        
    except Exception as e:
        logger.error(f"AI response error: {e}")
        return "I'm here to support you. Could you tell me more about how you're feeling?"

# ============= API ROUTES =============
@api_router.get("/")
async def root():
    return {"message": "CompanionBot API - Mental Health Support"}

# Authentication Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create user
    user_doc = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "password_hash": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create token
    token = create_token(user.username)
    
    return TokenResponse(token=token, username=user.username)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"username": user.username})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(user.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_token(user.username)
    
    return TokenResponse(token=token, username=user.username)

# Chat Routes
@api_router.post("/chat/message", response_model=ChatMessageResponse)
async def send_message(
    request: ChatMessageRequest,
    username: str = Depends(get_current_user)
):
    try:
        # Analyze sentiment
        sentiment_label, sentiment_score = await analyze_sentiment(request.message)
        
        # Get AI response
        bot_response = await get_ai_response(request.message, sentiment_label, username)
        
        # Store in database
        chat_doc = {
            "id": str(uuid.uuid4()),
            "username": username,
            "user_message": request.message,
            "bot_response": bot_response,
            "sentiment": sentiment_label,
            "sentiment_score": sentiment_score,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await db.chats.insert_one(chat_doc)
        
        return ChatMessageResponse(
            id=chat_doc['id'],
            user_message=request.message,
            bot_response=bot_response,
            sentiment=sentiment_label,
            sentiment_score=sentiment_score,
            timestamp=datetime.fromisoformat(chat_doc['timestamp'])
        )
        
    except Exception as e:
        logger.error(f"Chat message error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@api_router.get("/chat/history", response_model=List[ChatHistoryItem])
async def get_chat_history(
    username: str = Depends(get_current_user),
    limit: int = 50
):
    try:
        chats = await db.chats.find(
            {"username": username},
            {"_id": 0}
        ).sort("timestamp", -1).limit(limit).to_list(limit)
        
        # Convert timestamps
        for chat in chats:
            if isinstance(chat['timestamp'], str):
                chat['timestamp'] = datetime.fromisoformat(chat['timestamp'])
        
        # Reverse to show oldest first
        chats.reverse()
        
        return chats
        
    except Exception as e:
        logger.error(f"Get history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat history")

@api_router.delete("/chat/clear")
async def clear_chat_history(username: str = Depends(get_current_user)):
    try:
        result = await db.chats.delete_many({"username": username})
        return {"message": f"Cleared {result.deleted_count} messages"}
    except Exception as e:
        logger.error(f"Clear history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear chat history")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
