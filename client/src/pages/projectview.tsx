import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ErDiagram from "@/components/ErDiagram";
import SchemaCode from "@/components/SchemaCode";
import EntityModal from "@/components/EntityModal";
import { useSchema } from "@/hooks/useSchema";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation, useRoute } from "wouter";
import { getAuth } from "firebase/auth";
import app from "@/auth/firebase_config";
import type { Field, Entity, Relationship, DatabaseSchema } from "@/types/er";

// Remove local type definitions for Field, Entity, Relationship, DatabaseSchema

export default function ProjectView() {
  // Initialize toast notification hook
  const { toast } = useToast();
  
  // Initialize location and routing hooks
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/project/:projectId');
  
  // Safely extract projectId with fallback
  const projectId = params?.projectId ?? '';
  
  // Initialize Firestore and Authentication
  const firestore = getFirestore();
  const auth = getAuth(app)
  const user = auth.currentUser;

  // Use custom schema hook for managing database schema
  const { 
    schema, 
    sqlCode, 
    dbType,
    updateSchema,
    resetSchema,
    changeDbType,
    updateCodeFromDiagram
  } = useSchema();
  
  // State for managing entity editing
  const [editEntityId, setEditEntityId] = useState<string | null>(null);
  const [addField, setAddField] = useState(false);

  // Effect to fetch project data when component mounts or projectId changes
  useEffect(() => {
    const fetchProject = async () => {
      const user = auth.currentUser;
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view the project",
          variant: "destructive"
        });
        setLocation("/dashboard");
        return;
      }

      // Check if projectId is provided
      if (!projectId) {
        toast({
          title: "Error",
          description: "No project ID provided",
          variant: "destructive"
        });
        setLocation("/dashboard");
        return;
      }

      try {
        // Fetch project document from Firestore
        const projectRef = doc(firestore, `users/${user.uid}/schemas/${projectId}`);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          // Update schema if project exists
          const projectData = projectSnap.data();
          updateSchema(projectData.schema);
        } else {
          // Show error if project not found
          toast({
            title: "Project Not Found",
            description: "The specified project could not be found",
            variant: "destructive"
          });
          setLocation("/dashboard");
        }
      } catch (error) {
        // Handle any errors during project fetching
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive"
        });
        setLocation("/dashboard");
      }
    };

    fetchProject();
  }, [projectId]);

  // Handler for exporting schema
  const handleExport = () => {
    if (!schema || !sqlCode) {
      toast({
        title: "Error",
        description: "No schema to export",
        variant: "destructive",
      });
      return;
    }
    
    // Create export data object
    const exportData = {
      schema,
      sqlCode,
      dbType,
      timestamp: new Date().toISOString()
    };
    
    // Create and trigger file download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `dbms-schema-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up download resources
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    // Show success toast
    toast({
      title: "Exported!",
      description: "Schema exported successfully",
    });
  };

  // Close entity modal handler
  const handleCloseEntityModal = () => {
    setEditEntityId(null);
    setAddField(false);
  };

  // Save entity handler
  const handleSaveEntity = (entity: any) => {
    if (!schema) return;
    
    // Update or add entity to schema
    const updatedEntities = editEntityId
      ? schema.entities.map(e => (e.id === editEntityId ? entity : e))
      : [...schema.entities, entity];
    
    updateSchema({
      ...schema,
      entities: updatedEntities,
    });
    
    handleCloseEntityModal();
  };

  // Edit entity handler
  const handleEditEntity = (entityId: string | null, addField: boolean = false) => {
    setEditEntityId(entityId);
    setAddField(addField);
  };

  // Render component
  return (
    <div className="h-screen flex flex-col">
      <Header 
        onExport={handleExport}
        onSave={() => {
          toast({
            title: "Coming Soon",
            description: "Project update functionality will be available soon",
          });
        }}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {schema ? (
          <>
            <ErDiagram 
              schema={schema}
              onUpdateSchema={updateSchema}
              onEditEntity={handleEditEntity}
            />
            
            <SchemaCode 
              sqlCode={sqlCode}
              dbType={dbType}
              onChangeDbType={changeDbType}
              onUpdateCode={updateCodeFromDiagram}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-50 p-6">
            <div className="text-center max-w-xl">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                Loading Project...
              </h2>
              <p className="text-neutral-600 mb-6">
                Retrieving your database schema details.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {editEntityId !== null && schema && (
        <EntityModal
          schema={schema}
          entityId={editEntityId}
          addField={addField}
          onClose={handleCloseEntityModal}
          onSave={handleSaveEntity}
        />
      )}
    </div>
  );
}