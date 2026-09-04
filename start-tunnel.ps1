# ==============================================================================
# Auto-Reconnecting Public Tunnel for Government College Rajahmundry Alumni App
# ==============================================================================

Write-Host "`n🎓 Starting GCRJY Alumni Connect Public Tunnel...`n" -ForegroundColor Green

while ($true) {
    Write-Host "[(Get-Date -Format 'HH:mm:ss')] Connecting to public tunnel gateway..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:127.0.0.1:5173 serveo.net
    Write-Host "Tunnel disconnected. Reconnecting in 3 seconds..." -ForegroundColor Red
    Start-Sleep -Seconds 3
}
