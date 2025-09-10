import streamlit as st
import requests

st.set_page_config(page_title="Kumbh Mela AI Prototype", page_icon="🕉️")

st.title("🕉️ Kumbh Mela AI Assistant (Prototype)")

st.write("Ask me anything about Kumbh Mela (location, safety, tips).")

question = st.text_input("Your Question:")

if st.button("Ask"):
    if question.strip() == "":
        st.warning("Please enter a question.")
    else:
        try:
            response = requests.get("http://127.0.0.1:5000/ask", params={"q": question})
            if response.status_code == 200:
                answer = response.json().get("answer", "No answer available.")
                st.success(answer)
            else:
                st.error("Backend error. Did you start backend.py?")
        except:
            st.error("Backend not running. Please run backend.py in another terminal.")
