$body = '{"username":"admin","password":"Admin@123456Secure!"}'
$login = Invoke-RestMethod -Uri 'http://localhost:5175/api/auth/login' -Method POST -Body $body -ContentType 'application/json'

Write-Host "Login Success: $($login.success)"
Write-Host "User: $($login.data.user.username) | Role: $($login.data.user.role)"

$token = $login.data.token
$headers = @{ "Authorization" = "Bearer $token" }

$dash = Invoke-RestMethod -Uri 'http://localhost:5175/api/admin/dashboard' -Method GET -Headers $headers
Write-Host "Dashboard Projects: $($dash.data.totalProjects)"
Write-Host "Dashboard Services: $($dash.data.totalServices)"
Write-Host "Dashboard Testimonials: $($dash.data.totalTestimonials)"
Write-Host "Dashboard Technologies: $($dash.data.totalTechnologies)"

# Test creating a contact inquiry (Lead)
$inquiryBody = '{"name":"Enterprise Client Inc","email":"cto@enterpriseclient.com","phone":"+1-555-0199","company":"Enterprise Client Inc","subject":"Multi-Tenant SaaS Migration","message":"We need an architect for our multi-tenant SaaS architecture on .NET 9 and Angular.","techStack":".NET 9 / SaaS"}'
$inquiryRes = Invoke-RestMethod -Uri 'http://localhost:5175/api/contact' -Method POST -Body $inquiryBody -ContentType 'application/json'
Write-Host "Contact Inquiry Created: $($inquiryRes.success)"

# Test Admin fetching the inquiry
$inquiries = Invoke-RestMethod -Uri 'http://localhost:5175/api/admin/inquiries' -Method GET -Headers $headers
Write-Host "Total Admin Inquiries: $($inquiries.data.items.Count)"
