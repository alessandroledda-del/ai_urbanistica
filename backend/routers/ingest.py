from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from core.ingestion import process_and_ingest_file

router = APIRouter()

@router.post("/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    level: str = Form(...),
    region: Optional[str] = Form(None),
    province: Optional[str] = Form(None),
    commune: Optional[str] = Form(None)
):
    """
    Upload a legal document (.txt or .pdf) and vectorise it with hierarchical metadata.
    Levels should be one of: 'nazionale', 'regionale', 'provinciale', 'comunale'.
    """
    valid_levels = ["nazionale", "regionale", "provinciale", "comunale"]
    if level not in valid_levels:
        raise HTTPException(status_code=400, detail=f"Livello non valido. Deve essere uno tra: {valid_levels}")
        
    metadata = {
        "level": level,
        "region": region if region else "",
        "province": province if province else "",
        "commune": commune if commune else "",
        "filename": file.filename
    }
    
    success = await process_and_ingest_file(file, metadata)
    if success:
        return {"message": f"Documento {file.filename} analizzato e ingerito nel database con successo."}
    else:
        raise HTTPException(status_code=500, detail="Errore nell'ingestion del documento.")
