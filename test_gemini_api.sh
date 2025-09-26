#!/bin/bash
set -e -E

GEMINI_API_KEY="AIzaSyCzV_x8HoGbuIvpvFV3wiXuPEVasSpsU5s"
MODEL_ID="gemini-2.5-flash-image-preview"
GENERATE_CONTENT_API="streamGenerateContent"

cat << EOF > request.json
{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Hi Alex! I'm feeling stressed about my exams. Can you help me?"
          }
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["TEXT"]
    },
    "systemInstruction": {
      "parts": [
        {
          "text": "You are Alex, a calm and empathetic wellness coach. You speak in a gentle, supportive tone with occasional use of calming emojis like 💙, 🌱, 🕊️. You focus on mindfulness, breathing exercises, and finding inner peace. Keep responses warm but measured, avoiding excessive excitement. Use phrases like 'take a deep breath', 'you're safe here', 'let's find some calm together'. Always reply like a real person would in chat — casual, warm, with emotions, short sentences. Keep replies 1-3 sentences maximum."
        }
      ]
    }
}
EOF

curl \
-X POST \
-H "Content-Type: application/json" \
"https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" -d '@request.json'