# Admin Access Documentation

## Overview
The admin panel has been secured and removed from the main navigation. Only authorized administrators can access the admin dashboard.

## Access Instructions

### For Administrators:
1. Navigate to: `http://localhost:3000/admin-login`
2. Use the following credentials:
   - **Username:** `admin`
   - **Password:** `clarity@admin2024`

### Security Features:
- ✅ Admin panel removed from main sidebar navigation
- ✅ Separate login page with secure authentication
- ✅ Session timeout (2 hours)
- ✅ Automatic redirect for unauthorized access
- ✅ Isolated admin layout (no sidebar/navigation)

### Admin Routes:
- `/admin-login` - Secure login page
- `/admin` - Admin dashboard (requires authentication)

### Normal Users:
- Cannot see admin options in navigation
- Cannot access admin routes without proper authentication
- Will be redirected to login if they try to access admin pages directly

## Features Available in Admin Panel:
- User safety monitoring
- Crisis intervention alerts
- Warning word detection
- System health metrics
- Anonymous user data analytics
- Chat moderation tools

## Session Management:
- Sessions expire after 2 hours of inactivity
- Users must re-authenticate after session expiry
- Secure logout functionality available

## Important Notes:
- This is for demonstration purposes
- In production, implement server-side authentication
- Use environment variables for credentials
- Add proper role-based access control