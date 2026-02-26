import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.chat_models import ChatYandexGPT
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"


def load_env() -> None:
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        load_dotenv(env_path)


def build_vectorstore():
    if not DATA_DIR.exists():
        raise RuntimeError(f"Папка с данными не найдена: {DATA_DIR}")

    loader = DirectoryLoader(
        str(DATA_DIR),
        glob="**/*.txt",
        loader_cls=TextLoader,
        show_progress=True,
    )
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(chunks, embeddings)
    return vectorstore


def build_llm():
    api_key = os.getenv("YC_API_KEY")
    folder_id = os.getenv("YC_FOLDER_ID")

    if not api_key or not folder_id:
        raise RuntimeError(
            "Нужно задать переменные окружения YC_API_KEY и YC_FOLDER_ID "
            "(см. .env.example)."
        )

    # LangChain сам подхватит стандартный endpoint Yandex Cloud
    llm = ChatYandexGPT(
        api_key=api_key,
        folder_id=folder_id,
        # Можно переопределить модель/версию через model_uri, если нужно:
        # model_uri="gpt://<folder-id>/yandexgpt-lite/latest",
    )
    return llm


def build_rag_chain():
    vectorstore = build_vectorstore()
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    llm = build_llm()

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
    )
    return qa_chain


def main():
    load_env()

    print("Строю векторный индекс по локальным документам...")
    qa_chain = build_rag_chain()
    print("Готово. Можно задавать вопросы (пустой ввод — выход).")

    while True:
        query = input("\nВопрос: ").strip()
        if not query:
            break

        result = qa_chain.invoke({"query": query})
        answer = result.get("result")
        sources = result.get("source_documents") or []

        print("\n=== Ответ ===")
        print(answer)

        print("\n=== Источники ===")
        for i, doc in enumerate(sources, start=1):
            print(f"[{i}] {doc.metadata.get('source')}")


if __name__ == "__main__":
    main()

