import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Database, 
  Eye, 
  FolderPlus, 
  Settings,
  User
} from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { useSchema } from '@/hooks/useSchema';
import { useLocation } from 'wouter';
import app from '@/auth/firebase_config';

// TypeScript interface for Schema Document
interface SchemaDocument {
  id: string;
  prompt: string;
  dbType: string;
  schema: any;
  sqlCode: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const SchemaDashboard: React.FC = () => {
  // State management
  const [schemas, setSchemas] = useState<SchemaDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [user, setUser] = useState<any>(null);

  // Hooks
  const [location, setLocation] = useLocation();
  const { generateSchema } = useSchema();
  
  // Firebase instances
  const auth = getAuth(app);
  const firestore = getFirestore();

  // Manage Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchSchemas(currentUser);
      } else {
        // Redirect to login if no user is authenticated
        setLocation('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Fetch user's schemas
  const fetchSchemas = async (currentUser: any) => {
    try {
      const schemasRef = collection(firestore, `users/${currentUser.uid}/schemas`);
      const schemasQuery = query(
        schemasRef, 
        orderBy('createdAt', 'desc')
      );

      const schemaSnapshot = await getDocs(schemasQuery);
      const fetchedSchemas: SchemaDocument[] = schemaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SchemaDocument));

      setSchemas(fetchedSchemas);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching schemas:', error);
      setIsLoading(false);
    }
  };

  // Create new project handler
  const handleCreateProject = async () => {
    if (!newProjectPrompt.trim()) {
      alert('Please enter a project description');
      return;
    }

    try {
      // Use the generateSchema method from useSchema hook
      generateSchema(newProjectPrompt);
      
      // Navigate to the home page to continue schema generation
      setLocation('/');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  // View project handler
  const handleViewProject = (projectId: string) => {
    setLocation(`/project/${projectId}`);
  };

  // Logout handler
  const handleLogout = () => {
    auth.signOut();
    setLocation('/');
  };

  // Render loading state if user is not yet determined
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r flex flex-col">
        <div className="flex items-center mb-8">
          <Database className="mr-2 text-blue-600" size={24} />
          <h1 className="text-xl font-bold">AutoDB.AI</h1>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <User className="w-10 h-10 text-gray-500 mr-3" />
          )}
          <div>
            <p className="font-semibold text-sm">{user.displayName || 'User'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <LayoutDashboard className="mr-2" size={18} />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Settings className="mr-2" size={18} />
            Settings
          </Button>
        </nav>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full mt-4"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <Button 
            variant="outline"
            onClick={() => setLocation('/home')}
          >
            <FolderPlus className="mr-2" size={18} />
            Create Project
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48 bg-gray-200 rounded"></CardContent>
              </Card>
            ))}
          </div>
        ) : schemas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No projects yet. Create your first database schema!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {schemas.map(schema => (
              <Card 
                key={schema.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>{schema.prompt}</CardTitle>
                </CardHeader>
                
                <CardFooter className="flex justify-between">
                  <small className="text-gray-500">
                    {new Date(schema.createdAt.seconds * 1000).toLocaleDateString()}
                  </small>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewProject(schema.id.toString())}
                  >
                    <Eye className="mr-2" size={16} />
                    View Project
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SchemaDashboard;