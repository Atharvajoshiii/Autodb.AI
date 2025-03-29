import { Button } from "@/components/ui/button";
import { 
  DownloadIcon, 
  SaveIcon, 
  Database, 
  LogOutIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import app from "@/auth/firebase_config";
import { useLocation } from "wouter";

interface HeaderProps {
  onExport: () => void;
  onSave: () => void;
}

export default function Header({ onExport, onSave }: HeaderProps) {
  const [location , setLocation] = useLocation();
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      setLocation('/')
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () =>{
    setLocation('/auth')
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Title */}
          <div className="flex items-center">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-semibold text-neutral-900">AUTODB.AI</h1>
          </div>

          {/* Buttons & User Info */}
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="ml-2" onClick={onExport}>
              <DownloadIcon className="mr-1 h-4 w-4" />
              Export
            </Button>
            

            {/* Show user profile if logged in */}
            {user ? (
              <div className="flex items-center ml-4 space-x-3">
                <img 
                  src={user.photoURL || "/default-avatar.png"} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border border-gray-300"
                />
                <span className="text-sm font-medium">{user.displayName}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={handleLogin}
          >
            <LogOutIcon className="mr-1 h-4 w-4" />
            login
          </Button>}
          </div>
        </div>
      </div>
    </header>
  );
}
