from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

GEMINI_API_KEY = "AIzaSyAGpv1qwFiHjMhnOd1KaI-0rm7rO8O4-Kw"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

@app.route('/ask')
def ask():
    question = request.args.get("q", "").lower()
    # Only use Gemini for Kumbh Mela or Prayagraj specific queries
    if ("kumbh" in question or "prayagraj" in question):
        payload = {
            "contents": [
                {"parts": [{"text": question}]}
            ]
        }
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
        }
        try:
            resp = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                # Extract the answer from Gemini response
                answer = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No answer from Gemini.")
            else:
                answer = "AI backend error: Gemini API returned status {}.".format(resp.status_code)
        except Exception as e:
            answer = f"AI backend error: {str(e)}"
        return jsonify({"answer": answer})
    # Fallback to static answers for other queries
    if "location" in question:
        answer = "Kumbh Mela 2025 is at Prayagraj (Allahabad), near the Sangam (confluence of rivers)."
    elif "safety" in question:
        answer = "Stay with your group, keep emergency contacts handy, and follow police instructions."
    elif "crowd" in question:
        answer = "Millions of devotees gather, especially on main bathing dates. Plan accordingly."
    else:
        answer = "This is a prototype. Ask about location, safety, or crowd for answers."
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)
