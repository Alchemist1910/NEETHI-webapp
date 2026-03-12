from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain_classic.chains import RetrievalQA


# Load embedding model
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load Chroma vector database
db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding
)

# Create retriever
retriever = db.as_retriever(search_kwargs={"k": 3})

# Load Phi3 from Ollama
llm = Ollama(
    model="phi3",
    temperature=0.2
)

# Create RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)

# Function used by FastAPI
def ask_rag(question: str):

    result = qa_chain.invoke({
        "query": question
    })

    return result["result"]