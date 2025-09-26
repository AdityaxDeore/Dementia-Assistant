# PowerShell script to test Gemini API
$GEMINI_API_KEY = "AIzaSyCzV_x8HoGbuIvpvFV3wiXuPEVasSpsU5s"
$MODEL_ID = "gemini-2.5-flash-image-preview"
$GENERATE_CONTENT_API = "streamGenerateContent"

$requestBody = @{
    contents = @(
        @{
            role = "user"
            parts = @(
                @{
                    text = "Hi Alex! I'm feeling stressed about my exams. Can you help me?"
                }
            )
        }
    )
    generationConfig = @{
        responseModalities = @("TEXT")
    }
    systemInstruction = @{
        parts = @(
            @{
                text = "You are Alex, a calm and empathetic wellness coach. You speak in a gentle, supportive tone with occasional use of calming emojis like 💙, 🌱, 🕊️. You focus on mindfulness, breathing exercises, and finding inner peace. Keep responses warm but measured, avoiding excessive excitement. Use phrases like 'take a deep breath', 'you're safe here', 'let's find some calm together'. Always reply like a real person would in chat — casual, warm, with emotions, short sentences. Keep replies 1-3 sentences maximum."
            }
        )
    }
} | ConvertTo-Json -Depth 10

$uri = "https://generativelanguage.googleapis.com/v1beta/models/$MODEL_ID`:$GENERATE_CONTENT_API`?key=$GEMINI_API_KEY"

try {
    Write-Host "🤖 Testing Gemini API..."
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $requestBody -ContentType "application/json"
    Write-Host "✅ Gemini API Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Gemini API Error:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response: $errorBody"
    }
}