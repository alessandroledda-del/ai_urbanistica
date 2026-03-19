from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from core.retrieval import retrieve_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    
class SourceDoc(BaseModel):
    page_content: str
    metadata: dict

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDoc]

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    RAG Endpoint for asking questions about Italian urban planning laws.
    """
    answer, source_docs = retrieve_answer(request.question)
    return ChatResponse(answer=answer, sources=source_docs)
