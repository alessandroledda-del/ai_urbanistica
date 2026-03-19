import tempfile
import os
from fastapi import UploadFile
from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from .config import settings

def get_vectorstore():
    embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
    vectorstore = Chroma(
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        embedding_function=embeddings,
        collection_name="urbanistica_docs"
    )
    return vectorstore

async def process_and_ingest_file(upload: UploadFile, metadata: dict):
    # Save UploadFile to a temporary file for loader
    suffix = ".pdf" if upload.filename.endswith(".pdf") else ".txt"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await upload.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Load document
        if suffix == ".pdf":
            # Just using PyMuPDF or basic PDF loader wrapper
            from langchain_community.document_loaders import PyPDFLoader
            loader = PyPDFLoader(tmp_path)
            docs = loader.load()
        else:
            loader = TextLoader(tmp_path)
            docs = loader.load()
            
        # Add our custom metadata to each document page loaded
        for doc in docs:
            # We enforce string values for ChromaDB metadata
            doc.metadata.update({k: str(v) for k, v in metadata.items()})

        # Chunk the text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        splits = text_splitter.split_documents(docs)

        # Ingest to ChromaDB
        vectorstore = get_vectorstore()
        vectorstore.add_documents(documents=splits)
        
        return True

    finally:
        os.remove(tmp_path)
