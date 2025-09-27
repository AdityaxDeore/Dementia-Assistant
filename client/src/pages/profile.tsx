import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/ui/back-button";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  Save, 
  Edit3, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings,
  Activity,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "", 
    email: "",
    username: ""
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    
    // Initialize profile data from user
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || ""
      });
    }
  }, [isAuthenticated, user, setLocation]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated! ✅",
        description: "Your profile changes have been saved successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast({
        title: "Confirmation Required",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - in real app, this would delete the user account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      logout();
      setLocation("/");
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteConfirm("");
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    setLocation("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.firstName || user.username} {user.lastName}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active Member
                  </Badge>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing || isLoading}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing || isLoading}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing || isLoading}
                    placeholder="Choose a username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing || isLoading}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Your Activity
              </CardTitle>
              <CardDescription>
                Track your wellness journey and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-50 dark:bg-emerald-950">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">7</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">Days Active</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Sessions</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">5</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Goals Set</div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Great progress! You've been consistently engaging with your wellness journey.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Account Security
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logout Section */}
              <div className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold">Session Management</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>

              {/* Delete Account Section */}
              <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg space-y-3">
                <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>

              {/* Delete Confirmation Dialog */}
              {showDeleteDialog && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="space-y-3">
                    <div>
                      <strong>This action cannot be undone!</strong>
                      <p className="mt-1">This will permanently delete your account and remove all your data.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirm">
                        Type <strong>DELETE</strong> to confirm:
                      </Label>
                      <Input
                        id="deleteConfirm"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowDeleteDialog(false);
                          setDeleteConfirm("");
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAccount}
                        disabled={isLoading || deleteConfirm !== "DELETE"}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Forever"
                        )}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}