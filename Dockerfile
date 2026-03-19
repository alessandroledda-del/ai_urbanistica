# === Fase 1: Build del Frontend React ===
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
# Copia e installa dipendenze frontend
COPY frontend/package*.json ./
RUN npm install

# Copia il resto e compila
COPY frontend/ ./
RUN npm run build

# === Fase 2: Configurazione del Backend Python ===
FROM python:3.9-slim

WORKDIR /app

# Installa dipendenze di sistema minime spesso richieste per i calcoli o vectorDB
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Configura l'ambiente Python 
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia il file dei requisiti
COPY backend/requirements.txt ./backend/

# Aggiorna pip e installa i pacchetti
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copia il codice backend
COPY backend/ ./backend/

# Copia i file React Buildati dal frontend-builder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Imposta la cartella di base per eseguire il backend
WORKDIR /app/backend

# Assicurati che lo script conosca l'env
ENV CHROMA_PERSIST_DIRECTORY="/app/chroma_db"

# Esponi la porta 7860 (Standard Hugging Face Spaces per i container Docker)
EXPOSE 7860

# Comando di avvio unificato per FastAPI e Frontend 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
