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
  getDocs,
  addDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { useSchema } from '@/hooks/useSchema';
import { useLocation } from 'wouter';
import app from '@/auth/firebase_config';
import FirestoreTest from '@/components/FirestoreTest';

// TypeScript interface for Schema Document
interface SchemaDocument {
  id: string;
  prompt: string;
  dbType: string;
  schema: any;
  sqlCode: string;
  createdAt: any; // More flexible type for Firestore timestamp
}

const SchemaDashboard: React.FC = () => {
  // State management
  const [schemas, setSchemas] = useState<SchemaDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const [location, setLocation] = useLocation();
  const { generateSchema } = useSchema();
  
  // Firebase instances
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Manage Authentication State
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
      if (currentUser) {
        console.log('Current user ID:', currentUser.uid);
        console.log('Current user email:', currentUser.email);
        setUser(currentUser);
        
        // Test Firebase connection before fetching schemas
        testFirebaseConnection();
        fetchSchemas(currentUser);
      } else {
        console.log('No user found, redirecting to login');
        // Redirect to login if no user is authenticated
        setLocation('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firestore connection...');
      const testRef = collection(firestore, 'test');
      console.log('Firestore collection reference created successfully');
      return true;
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      setError(`Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    if (user) {
      setIsLoading(true);
      setError(null);
      fetchSchemas(user);
    }
  };

  // Test data writing and reading
  const handleTestFirestore = async () => {
    if (!user) return;
    
    try {
      console.log('Testing Firestore write/read...');
      
      // Test write
      const testRef = collection(firestore, `users/${user.uid}/test`);
      const testDoc = await addDoc(testRef, {
        message: "Test message",
        timestamp: new Date(),
        testId: Math.random().toString(36)
      });
      console.log('Test document written with ID:', testDoc.id);
      
      // Test read
      const testQuery = query(testRef);
      const testSnapshot = await getDocs(testQuery);
      console.log('Test documents read:', testSnapshot.size);
      
      alert(`Firestore test successful! Written and read ${testSnapshot.size} documents.`);
    } catch (error) {
      console.error('Firestore test failed:', error);
      alert(`Firestore test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Fetch user's schemas
  const fetchSchemas = async (currentUser: any) => {
    console.log('Fetching schemas for user:', currentUser.uid);
    setIsLoading(true);
    setError(null);
    
    try {
      const schemasRef = collection(firestore, `users/${currentUser.uid}/schemas`);
      console.log('Collection path:', `users/${currentUser.uid}/schemas`);
      
      // First try without ordering to see if there are any documents
      const simpleSnapshot = await getDocs(schemasRef);
      console.log('Simple query result - size:', simpleSnapshot.size);
      console.log('Simple query result - empty:', simpleSnapshot.empty);
      
      if (!simpleSnapshot.empty) {
        simpleSnapshot.forEach((doc) => {
          console.log('Found document:', doc.id, doc.data());
        });
      }
      
      // If simple query works, try with ordering
      const schemasQuery = query(
        schemasRef, 
        orderBy('createdAt', 'desc')
      );

      const schemaSnapshot = await getDocs(schemasQuery);
      console.log('Ordered query snapshot size:', schemaSnapshot.size);
      console.log('Ordered query snapshot empty:', schemaSnapshot.empty);
      
      if (schemaSnapshot.empty) {
        console.log('No documents found in the ordered collection');
        setSchemas([]);
        setIsLoading(false);
        return;
      }
      
      const fetchedSchemas: SchemaDocument[] = schemaSnapshot.docs.map(doc => {
        console.log('Document ID:', doc.id);
        console.log('Document data:', doc.data());
        return {
          id: doc.id,
          ...doc.data()
        } as SchemaDocument;
      });

      console.log('Fetched schemas:', fetchedSchemas);
      setSchemas(fetchedSchemas);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching schemas:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      setError(`Failed to fetch schemas: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Render loading state if user is not yet determined or data is loading
  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
          {user && <p className="text-sm text-gray-500">Fetching your projects...</p>}
        </div>
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
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <Database className="mr-2" size={18} />
              Refresh
            </Button>
            <Button 
              variant="ghost"
              onClick={handleTestFirestore}
              disabled={isLoading}
            >
              <Settings className="mr-2" size={18} />
              Test DB
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation('/home')}
            >
              <FolderPlus className="mr-2" size={18} />
              Create Project
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </div>
        )}

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
                    {schema.createdAt && schema.createdAt.seconds 
                      ? new Date(schema.createdAt.seconds * 1000).toLocaleDateString()
                      : 'Unknown date'
                    }
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