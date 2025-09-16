import { AdminPanel } from "@/components/admin-panel";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (adminAuth === 'true' && loginTime) {
        const currentTime = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        
        if (currentTime - loginTimestamp < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminLoginTime');
          setLocation('/admin-login');
        }
      } else {
        // Not authenticated, redirect to login
        setLocation('/admin-login');
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, [setLocation]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setLocation('/admin-login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 mx-auto text-indigo-600 animate-pulse" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                You are not authorized to access this page. Please log in with valid administrator credentials.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => setLocation('/admin-login')} 
              className="w-full"
            >
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor user safety, system health, and crisis prevention analytics
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <AdminPanel />
    </div>
  );
}