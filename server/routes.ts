import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AnthropicService } from "./anthropic";

// --- Local type definitions (copied from shared/types.ts) ---
export interface Field {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  defaultValue: string | null;
  references?: {
    table: string;
    field: string;
  };
}

export interface Entity {
  id: string;
  name: string;
  fields: Field[];
  position: { x: number; y: number };
}

export interface Relationship {
  id: string;
  sourceEntityId: string;
  sourceFieldId: string;
  targetEntityId: string;
  targetFieldId: string;
  type: string;
}

export interface DatabaseSchema {
  entities: Entity[];
  relationships: Relationship[];
}

export interface GenerateSchemaRequest {
  prompt: string;
  dbType: string;
}

export interface GenerateSchemaResponse {
  schema: DatabaseSchema;
  sqlCode: string;
}
// --- End local type definitions ---

export async function registerRoutes(app: Express): Promise<Server> {
  // PUT API routes under /api prefix
  const apiRouter = app.route("/api");

  // Endpoint to generate schema from prompt
  app.post("/api/schema/generate", async (req: Request, res: Response) => {
    try {
      const { prompt, dbType = "mysql" } = req.body as GenerateSchemaRequest;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      // Get API key from environment variable (Replit secrets)
      const apiKey = process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: "API key is not configured on the server" });
      }
      
      // Initialize Anthropic service with API key
      const anthropicService = new AnthropicService();
      
      // Generate schema from prompt
      const { schema, sqlCode } = await anthropicService.generateDatabaseSchema(prompt, dbType);
      
      return res.status(200).json({
        schema,
        sqlCode
      });
    } catch (error) {
      console.error("Error generating schema:", error);
      return res.status(500).json({ 
        message: "Failed to generate schema", 
        error: (error as Error).message 
      });
    }
  });

  // Endpoint to validate API key
  app.post("/api/auth/validate-key", async (req: Request, res: Response) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }
      
      // Simple validation by creating a new Anthropic service
      // A more robust implementation would make a lightweight call to the API
      try {
        const anthropicService = new AnthropicService();
        return res.status(200).json({ valid: true });
      } catch (error) {
        return res.status(200).json({ valid: false });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      return res.status(500).json({ message: "Failed to validate API key" });
    }
  });

  // Project endpoints
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const { name, description, prompt, dbType, entities, relationships, sqlSchema } = req.body;
      
      // For simplicity, use a mock user ID
      const userId = 1;
      
      const project = await storage.createProject({
        userId,
        name,
        description,
        prompt,
        dbType,
        entities,
        relationships,
        sqlSchema
      });
      
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      // For simplicity, use a mock user ID
      const userId = 1;
      
      const projects = await storage.getProjectsByUserId(userId);
      return res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storage.updateProject(id, req.body);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ message: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
