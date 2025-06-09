import { users, type User, type InsertUser } from "@shared/schema";
import { projects, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserApiKey(userId: number, apiKey: string): Promise<User | undefined>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private userIdCounter: number;
  private projectIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      apiKey: insertUser.apiKey ?? null // Ensure apiKey is always present
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserApiKey(userId: number, apiKey: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, apiKey };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      name: insertProject.name,
      userId: insertProject.userId ?? null,
      description: insertProject.description ?? null,
      prompt: insertProject.prompt ?? null,
      dbType: insertProject.dbType ?? null,
      entities: insertProject.entities,
      relationships: insertProject.relationships,
      sqlSchema: insertProject.sqlSchema ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...projectUpdate,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    if (!this.projects.has(id)) return false;
    return this.projects.delete(id);
  }
}

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

export const storage = new MemStorage();
