# Test the new Gemini API key
$body = @{
    message = "Hello Alex, I need help with memory activities"
    personalityId = "alex"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/chat/gemini" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "✅ SUCCESS! Gemini API Response:" -ForegroundColor Green
    Write-Host $response.response -ForegroundColor Cyan
    Write-Host "Provider: $($response.provider)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}