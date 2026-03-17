import os
from dotenv import load_dotenv

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq


# Load env
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")


# Embeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Vector DB
db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding
)

retriever = db.as_retriever(search_kwargs={"k": 4})


# Groq LLM (low temp = accurate)
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=api_key,
    temperature=0.1
)


# ✅ SIMPLE + CLEAN OUTPUT FUNCTION
def ask_rag(question: str):

    try:
        # Get relevant docs
        docs = retriever.invoke(question)

        context = "\n\n".join([doc.page_content for doc in docs])

        # 🔥 SIMPLE PROMPT (short + clear)
        prompt = f"""
You are a legal assistant.

Answer in a very simple and short way.

Rules:
- Max 4 lines
- Use bullet points
- No long paragraphs
- Be clear and direct

Context:
{context}

Question:
{question}

Answer:
"""

        response = llm.invoke(prompt)

        return response.content.strip()

    except Exception as e:
        print("ERROR:", e)
        return "⚠️ Error generating answer"