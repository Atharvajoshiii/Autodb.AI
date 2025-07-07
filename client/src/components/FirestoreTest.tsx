import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '@/auth/firebase_config';
import { Button } from '@/components/ui/button';

const FirestoreTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testFirestore = async () => {
    setIsLoading(true);
    setLogs([]);
    
    try {
      const user = auth.currentUser;
      addLog(`Current user: ${user ? user.email : 'No user'}`);
      addLog(`User UID: ${user ? user.uid : 'No UID'}`);
      addLog(`User authenticated: ${user ? 'Yes' : 'No'}`);
      
      if (!user) {
        addLog('No authenticated user found');
        setIsLoading(false);
        return;
      }
      
      // Test creating a collection reference
      const testCollectionRef = collection(firestore, `users/${user.uid}/test`);
      addLog('Created collection reference successfully');
      
      // Test writing a document
      addLog('Attempting to write document...');
      const docRef = await addDoc(testCollectionRef, {
        message: 'Test message',
        timestamp: new Date(),
        userId: user.uid
      });
      addLog(`✓ Document written with ID: ${docRef.id}`);
      
      // Test reading documents
      addLog('Attempting to read documents...');
      const querySnapshot = await getDocs(testCollectionRef);
      addLog(`✓ Read ${querySnapshot.size} documents from test collection`);
      
      // Test the actual schemas collection
      addLog('Testing schemas collection...');
      const schemasRef = collection(firestore, `users/${user.uid}/schemas`);
      addLog('Created schemas collection reference');
      
      addLog('Attempting to read schemas...');
      const schemasSnapshot = await getDocs(schemasRef);
      addLog(`✓ Read ${schemasSnapshot.size} documents from schemas collection`);
      
      if (schemasSnapshot.size > 0) {
        addLog('Found existing schemas:');
        schemasSnapshot.forEach((doc) => {
          const data = doc.data();
          addLog(`  - Schema: ${doc.id}, Prompt: ${data.prompt || 'No prompt'}`);
        });
      } else {
        addLog('No existing schemas found');
      }
      
      addLog('🎉 All tests passed! Firestore is working correctly.');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Error: ${errorMessage}`);
      
      if (errorMessage.includes('permission')) {
        addLog('This appears to be a permissions issue with Firestore rules.');
        addLog('Please check your Firestore security rules in the Firebase Console.');
      } else if (errorMessage.includes('network')) {
        addLog('This appears to be a network connectivity issue.');
      }
      
      console.error('Firestore test error:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Firestore Connection Test</h3>
      
      <Button 
        onClick={testFirestore} 
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? 'Testing...' : 'Test Firestore'}
      </Button>
      
      <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">Click "Test Firestore" to run diagnostics</div>
        ) : (
          logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default FirestoreTest;
