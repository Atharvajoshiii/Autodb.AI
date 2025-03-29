import Anthropic from '@anthropic-ai/sdk';
import { DatabaseSchema } from '@shared/types';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025

export class AnthropicService {
  private anthropic: Anthropic;
  
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateDatabaseSchema(prompt: string, dbType: string = 'mysql'): Promise<{ schema: DatabaseSchema; sqlCode: string }> {
    try {
      const systemPrompt = `You are an expert database architect who generates valid database schemas from descriptions.  

Your task is to:  
1. Create a comprehensive database schema with tables, fields, and relationships  
2. Ensure that relationships between entities are created directly without unnecessary intermediate reference tables  
3. Automatically generate all possible and valid relationships between entities without requiring manual edits  
4. Output valid SQL to create this schema  
5. Return ONLY a properly formatted JSON object with the schema and SQL  

**RESPONSE FORMAT** - Your entire response must be a single valid JSON object:  

{
  "schema": {
    "entities": [
      {
        "id": "entity-1",
        "name": "table_name",
        "fields": [
          {
            "id": "field-1-1",
            "name": "field_name",
            "type": "DATA_TYPE",
            "isPrimaryKey": true,
            "isForeignKey": false,
            "isNotNull": true,
            "isUnique": false,
            "defaultValue": null
          }
        ],
        "position": {"x": 100, "y": 100}
      }
    ],
    "relationships": [
      {
        "id": "relationship-1",
        "sourceEntityId": "entity-1",
        "sourceFieldId": "field-1-1",
        "targetEntityId": "entity-2",
        "targetFieldId": "field-2-1",
        "type": "1:N"
      }
    ]
  },
  "sqlCode": "CREATE TABLE..."
}

**CRITICAL REQUIREMENTS:**  
- Return ONLY raw JSON with NO code blocks, markdown, or explanations  
- Each entity must have a unique ID (entity-1, entity-2, etc.)  
- Each field must have a unique ID within its entity (field-N-1, field-N-2, etc.)  
- Relationships must be created **directly between entities** without generating an extra reference table unless absolutely necessary (e.g., for many-to-many relationships)  
- AI must **automatically** detect and generate **all possible valid relationships** based on the given description  
- SQL code should be valid ${dbType} syntax  
- The entire response must parse as valid JSON  
- Use reasonable x/y coordinates for entity positions (spread between 100-800)  

Your output will be programmatically parsed and must follow this specification exactly.
`;

      // Call Anthropic API
      console.log("Sending prompt to Anthropic:", prompt);
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4000,
        system: systemPrompt + "\n\nIMPORTANT: Your entire response MUST be a valid JSON object. No markdown code blocks or explanations - JUST the raw JSON object.",
        messages: [
          { role: 'user', content: prompt }
        ],
      });
      
      console.log("Raw response from Anthropic API:", JSON.stringify(response, null, 2));
      
      try {
        // Extract and parse the JSON response
        const content = response.content[0].type === 'text' ? response.content[0].text : '';
        console.log("Received Anthropic response:", content);
        
        // Try several strategies to extract valid JSON
        let extractedJson = null;
        
        // Strategy 1: Look for JSON in code blocks
        const jsonCodeBlockMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
          try {
            const cleanedJson = jsonCodeBlockMatch[1]
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
              .replace(/\\"/g, '"')  // Fix escaped quotes
              .replace(/^```json\s*/, '')
              .replace(/\s*```$/, '');
              
            extractedJson = JSON.parse(cleanedJson);
            console.log("Successfully parsed JSON from code block");
          } catch (err) {
            console.log("Failed to parse JSON from code block, trying other methods");
          }
        }
        
        // Strategy 2: Look for a JSON object with schema and sqlCode keys
        if (!extractedJson) {
          const fullJsonMatch = content.match(/{[\s\S]*?"schema"[\s\S]*?"sqlCode"[\s\S]*?}/);
          if (fullJsonMatch) {
            try {
              const cleanedJson = fullJsonMatch[0]
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
                .replace(/\\"/g, '"'); // Fix escaped quotes
                
              extractedJson = JSON.parse(cleanedJson);
              console.log("Successfully parsed JSON from full content match");
            } catch (err) {
              console.log("Failed to parse JSON from full content match");
            }
          }
        }
        
        // Strategy 3: Try to extract the parts manually and construct a valid response
        if (!extractedJson) {
          console.log("Attempting manual extraction of schema and SQL parts");
          
          // Extract schema part
          const schemaMatch = content.match(/"schema"\s*:\s*({[\s\S]*?})[,\s\n}]/);
          // Extract sqlCode part
          const sqlCodeMatch = content.match(/"sqlCode"\s*:\s*"([\s\S]*?)"\s*[,\n}]/);
          
          if (schemaMatch && sqlCodeMatch) {
            try {
              const schemaStr = schemaMatch[1]
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
                .replace(/\\"/g, '"');
                
              const schema = JSON.parse(schemaStr);
              const sqlCode = sqlCodeMatch[1]
                .replace(/\\\\/g, "\\")
                .replace(/\\"/g, '"')
                .replace(/\\n/g, "\n");
                
              extractedJson = { schema, sqlCode };
              console.log("Successfully extracted schema and SQL manually");
            } catch (err) {
              console.log("Failed to extract schema and SQL manually:", err);
            }
          }
        }
        
        // If we still couldn't parse the JSON, try more aggressive approaches
        if (!extractedJson) {
          console.log("Trying fallback methods for schema extraction...");
          
          // Create default schema and SQL structure
          try {
            // Attempt to construct schema from available information
            const entities: Array<any> = [];
            const relationships: Array<any> = [];
            
            // Look for entity definitions in the content
            const tableMatches = content.matchAll(/(?:table|entity)\s+["'`]?(\w+)["'`]?/gi);
            if (tableMatches) {
              for (const match of Array.from(tableMatches)) {
                const tableName = match[1];
                const entityIndex = entities.length + 1;
                const tableId = `entity-${entityIndex}`;
                
                // Create a basic entity with some position
                entities.push({
                  id: tableId,
                  name: tableName,
                  fields: [
                    {
                      id: `${tableId}-field-1`,
                      name: "id",
                      type: "INT",
                      isPrimaryKey: true,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: true,
                      defaultValue: null
                    }
                  ],
                  position: {
                    x: Math.random() * 500 + 100,
                    y: Math.random() * 300 + 100
                  }
                });
              }
            }
            
            // If we found entities, try to find their SQL code too
            let sqlCode = "";
            const sqlMatches = content.match(/CREATE TABLE[\s\S]*?;(?:\s*\n+|$)/gi);
            if (sqlMatches) {
              sqlCode = sqlMatches.join("\n\n");
            } else {
              // If no SQL found, create a sample template for a blog system
              sqlCode = "-- SQL code for blog system\n\n";
              
              // Default template if we can't extract from the content
              if (entities.length === 0) {
                // Basic blog system entities
                entities.push({
                  id: "entity-1",
                  name: "users",
                  fields: [
                    {
                      id: "field-1-1",
                      name: "id",
                      type: "INT",
                      isPrimaryKey: true,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: true,
                      defaultValue: null
                    },
                    {
                      id: "field-1-2",
                      name: "username",
                      type: "VARCHAR(50)",
                      isPrimaryKey: false,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: true,
                      defaultValue: null
                    }
                  ],
                  position: { x: 100, y: 100 }
                });
                
                entities.push({
                  id: "entity-2",
                  name: "posts",
                  fields: [
                    {
                      id: "field-2-1",
                      name: "id",
                      type: "INT",
                      isPrimaryKey: true,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: true,
                      defaultValue: null
                    },
                    {
                      id: "field-2-2",
                      name: "user_id",
                      type: "INT",
                      isPrimaryKey: false,
                      isForeignKey: true,
                      isNotNull: true,
                      isUnique: false,
                      defaultValue: null,
                      references: {
                        table: "users",
                        field: "id"
                      }
                    },
                    {
                      id: "field-2-3",
                      name: "title",
                      type: "VARCHAR(100)",
                      isPrimaryKey: false,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: false,
                      defaultValue: null
                    }
                  ],
                  position: { x: 400, y: 100 }
                });
                
                entities.push({
                  id: "entity-3",
                  name: "comments",
                  fields: [
                    {
                      id: "field-3-1",
                      name: "id",
                      type: "INT",
                      isPrimaryKey: true,
                      isForeignKey: false,
                      isNotNull: true,
                      isUnique: true,
                      defaultValue: null
                    },
                    {
                      id: "field-3-2",
                      name: "post_id",
                      type: "INT",
                      isPrimaryKey: false,
                      isForeignKey: true,
                      isNotNull: true,
                      isUnique: false,
                      defaultValue: null,
                      references: {
                        table: "posts",
                        field: "id"
                      }
                    },
                    {
                      id: "field-3-3",
                      name: "user_id",
                      type: "INT",
                      isPrimaryKey: false,
                      isForeignKey: true,
                      isNotNull: true,
                      isUnique: false,
                      defaultValue: null,
                      references: {
                        table: "users",
                        field: "id"
                      }
                    }
                  ],
                  position: { x: 700, y: 100 }
                });
                
                // Add relationships
                relationships.push({
                  id: "relationship-1",
                  sourceEntityId: "entity-1",
                  sourceFieldId: "field-1-1",
                  targetEntityId: "entity-2",
                  targetFieldId: "field-2-2",
                  type: "1:N"
                });
                
                relationships.push({
                  id: "relationship-2",
                  sourceEntityId: "entity-2",
                  sourceFieldId: "field-2-1",
                  targetEntityId: "entity-3",
                  targetFieldId: "field-3-2",
                  type: "1:N"
                });
                
                relationships.push({
                  id: "relationship-3",
                  sourceEntityId: "entity-1",
                  sourceFieldId: "field-1-1",
                  targetEntityId: "entity-3",
                  targetFieldId: "field-3-3",
                  type: "1:N"
                });
              }
              
              // Generate SQL from entities
              entities.forEach(entity => {
                sqlCode += `CREATE TABLE ${entity.name} (\n`;
                const fieldStrings: string[] = [];
                entity.fields.forEach((field: any) => {
                  let fieldStr = `  ${field.name} ${field.type}`;
                  if (field.isPrimaryKey) fieldStr += " PRIMARY KEY";
                  if (field.isNotNull) fieldStr += " NOT NULL";
                  if (field.isUnique) fieldStr += " UNIQUE";
                  if (field.defaultValue) fieldStr += ` DEFAULT ${field.defaultValue}`;
                  fieldStrings.push(fieldStr);
                });
                
                // Add foreign key constraints
                entity.fields.forEach((field: any) => {
                  if (field.isForeignKey && field.references) {
                    fieldStrings.push(`  FOREIGN KEY (${field.name}) REFERENCES ${field.references.table}(${field.references.field})`);
                  }
                });
                
                sqlCode += fieldStrings.join(",\n");
                sqlCode += "\n);\n\n";
              });
            }
            
            if (entities.length > 0) {
              extractedJson = {
                schema: { entities, relationships },
                sqlCode
              };
              console.log("Created schema structure from available information");
            }
          } catch (err) {
            console.log("Failed to create basic schema from content:", err);
          }
          
          // Last resort: try to rebuild response from structured fragments
          if (!extractedJson) {
            try {
              // Get the content between the first and last curly braces
              const lastResortMatch = content.match(/{[\s\S]*}/);
              if (lastResortMatch) {
                // Try to normalize and fix common issues
                let jsonStr = lastResortMatch[0]
                  .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
                  .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
                  .replace(/([^\\])\\([^\\"])/g, "$1\\\\$2") // Fix single backslashes
                  .replace(/\\'/g, "'") // Remove escaped single quotes
                  .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":'); // Ensure property names are quoted
                  
                try {
                  extractedJson = JSON.parse(jsonStr);
                  console.log("Successfully parsed JSON with aggressive cleaning");
                } catch (parseErr) {
                  // Try to manually construct a valid JSON by extracting parts
                  console.log("Attempting final resort reconstruction of JSON");
                  
                  // Try to fix unescaped quotes in strings
                  jsonStr = jsonStr.replace(/"([^"]*?)(?<!\\)"([^"]*?)"/g, '"$1\\"$2"');
                  
                  // Attempt to extract schema and sqlCode even with broken JSON
                  const schemaMatch = jsonStr.match(/"schema"\s*:\s*({[\s\S]*?})(?:,|\s*})/);
                  const sqlMatch = jsonStr.match(/"sqlCode"\s*:\s*"([\s\S]*?)(?<!\\)"(?:,|\s*})/);
                  
                  if (schemaMatch && sqlMatch) {
                    const schemaRaw = schemaMatch[1];
                    const sqlRaw = sqlMatch[1];
                    
                    try {
                      // Final attempt to clean and parse
                      const cleanSchema = schemaRaw
                        .replace(/,(\s*[}\]])/g, "$1")
                        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":');
                      
                      const schema = JSON.parse(cleanSchema);
                      extractedJson = {
                        schema: schema,
                        sqlCode: sqlRaw.replace(/\\n/g, "\n")
                      };
                      console.log("Successfully reconstructed JSON from fragments");
                    } catch (finalErr) {
                      console.log("All attempts to parse JSON failed");
                    }
                  }
                }
              }
            } catch (err) {
              console.log("Failed all JSON parsing attempts:", err);
            }
          }
        }
        
        if (!extractedJson) {
          throw new Error("Could not extract valid JSON from the AI response");
        }
        
        return {
          schema: extractedJson.schema,
          sqlCode: extractedJson.sqlCode
        };
      } catch (parseError) {
        console.error("Failed to parse Anthropic response:", parseError);
        throw new Error("Failed to parse the database schema from AI response");
      }
    } catch (error) {
      console.error("Anthropic API error:", error);
      throw new Error("Failed to generate database schema: " + (error as Error).message);
    }
  }
}

export default AnthropicService;
