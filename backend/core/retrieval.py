from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from .config import settings
from .ingestion import get_vectorstore

def retrieve_answer(question: str):
    """
    RAG retrieval pipeline.
    """
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.0,
        openai_api_key=settings.OPENAI_API_KEY
    )

    system_prompt = (
        "Sei un assistente esperto in normativa urbanistica italiana. "
        "Usa i seguenti frammenti di contesto per rispondere alla domanda dell'utente. "
        "Le normative sono suddivise in scala nazionale, regionale, provinciale e comunale. "
        "Presta molta attenzione al livello normativo citato nei documenti. "
        "Se non conosci la risposta in base al contesto fornito, di' chiaramente che non hai informazioni sufficienti nei documenti scaricati. "
        "\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    response = rag_chain.invoke({"input": question})
    
    answer = response["answer"]
    # We want to return the raw source docs to the frontend
    sources = []
    if "context" in response:
        for doc in response["context"]:
            sources.append({
                "page_content": doc.page_content,
                "metadata": doc.metadata
            })
            
    return answer, sources
