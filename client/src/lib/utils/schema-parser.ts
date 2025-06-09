import type { Field, Entity, Relationship, DatabaseSchema } from "@/types/er";

/**
 * Parses SQL schema string to extract entities and their fields
 * @param schema SQL schema string
 * @returns DatabaseSchema representation of the schema
 */
export function parseSchemaToERD(schema: string): DatabaseSchema {
  const entities: Entity[] = [];
  const relationships: Relationship[] = [];
  
  // Regular expressions to match table creation and field definitions
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s*\(([\s\S]*?)\);/gim;
  const fieldRegex = /\s*["']?(\w+)["']?\s+([A-Za-z0-9() ]+)(?:\s+(\w+(?:\s+\w+)*))*(?:,|$)/gim;
  const foreignKeyRegex = /FOREIGN\s+KEY\s*\(["']?(\w+)["']?\)\s*REFERENCES\s+["']?(\w+)["']?\s*\(["']?(\w+)["']?\)/gim;
  
  // Find all CREATE TABLE statements
  let tableMatch;
  let entityIndex = 0;
  while ((tableMatch = tableRegex.exec(schema)) !== null) {
    const tableName = tableMatch[1];
    const tableContent = tableMatch[2];
    
    // Create entity for this table
    const entity: Entity = {
      id: `entity-${entityIndex++}`,
      name: tableName,
      fields: [],
      position: { x: 100 + (entityIndex * 300) % 900, y: 100 + Math.floor(entityIndex / 3) * 250 }
    };
    
    // Parse fields
    let fieldMatch;
    let fieldIndex = 0;
    while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
      if (fieldMatch[0].trim().startsWith('CONSTRAINT') || 
          fieldMatch[0].trim().startsWith('PRIMARY KEY') || 
          fieldMatch[0].trim().startsWith('FOREIGN KEY')) {
        continue; // Skip constraint definitions
      }
      
      const fieldName = fieldMatch[1];
      const fieldType = fieldMatch[2];
      const constraints = fieldMatch[3] ? fieldMatch[3].split(/\s+/) : [];
      
      const field: Field = {
        id: `field-${entityIndex}-${fieldIndex++}`,
        name: fieldName,
        type: fieldType.trim(),
        isPrimaryKey: constraints.includes('PRIMARY') || constraints.includes('IDENTITY') || constraints.includes('SERIAL'),
        isForeignKey: false,
        isNotNull: constraints.includes('NOT') && constraints.includes('NULL'),
        isUnique: constraints.includes('UNIQUE'),
        defaultValue: getDefaultValue(constraints)
      };
      
      entity.fields.push(field);
    }
    
    // Find primary keys in constraints
    const primaryKeyRegex = /PRIMARY\s+KEY\s*\(["']?(\w+(?:\s*,\s*["']?\w+["']?)*)["']?\)/gim;
    let pkMatch;
    if ((pkMatch = primaryKeyRegex.exec(tableContent)) !== null) {
      const pkFields = pkMatch[1].split(',').map(f => f.trim().replace(/["']/g, ''));
      for (const field of entity.fields) {
        if (pkFields.includes(field.name)) {
          field.isPrimaryKey = true;
        }
      }
    }
    
    entities.push(entity);
  }
  
  // Process foreign key relationships
  let relationshipIndex = 0;
  for (const entity of entities) {
    // Reset regex
    foreignKeyRegex.lastIndex = 0;
    
    // Find foreign key relationships in the schema
    const tableContent = schema.match(new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?["']?${entity.name}["']?\\s*\\((.*?)\\);`, 'ims'));
    
    if (tableContent && tableContent[1]) {
      let fkMatch;
      while ((fkMatch = foreignKeyRegex.exec(tableContent[1])) !== null) {
        const sourceFieldName = fkMatch[1];
        const targetEntityName = fkMatch[2];
        const targetFieldName = fkMatch[3];
        
        // Find the target entity
        const targetEntity = entities.find(e => e.name.toLowerCase() === targetEntityName.toLowerCase());
        if (targetEntity) {
          // Find the source and target fields
          const sourceField = entity.fields.find(f => f.name === sourceFieldName);
          const targetField = targetEntity.fields.find(f => f.name === targetFieldName);
          
          if (sourceField && targetField) {
            // Update the field to mark it as a foreign key
            sourceField.isForeignKey = true;
            sourceField.references = {
              table: targetEntityName,
              field: targetFieldName
            };
            
            // Create the relationship (assuming 1:N by default for foreign keys)
            relationships.push({
              id: `relationship-${relationshipIndex++}`,
              sourceEntityId: targetEntity.id,
              sourceFieldId: targetField.id,
              targetEntityId: entity.id,
              targetFieldId: sourceField.id,
              type: "1:N"
            });
          }
        }
      }
    }
  }
  
  return { entities, relationships };
}

// Helper function to extract default value from constraints
function getDefaultValue(constraints: string[]): string | undefined {
  const defaultValueRegex = /DEFAULT\s+(.+)/i;
  const fullConstraintStr = constraints.join(' ');
  const match = fullConstraintStr.match(defaultValueRegex);
  return match ? match[1] : undefined;
}

/**
 * Converts a DatabaseSchema to SQL schema string
 * @param diagram DatabaseSchema
 * @param dbType Database type
 * @returns SQL schema string
 */
export function convertERToSchema(diagram: DatabaseSchema, dbType: string): string {
  const { entities, relationships } = diagram;
  let schema = '';
  
  // Create tables
  for (const entity of entities) {
    schema += `CREATE TABLE ${entity.name} (\n`;
    
    const fieldLines = entity.fields.map(field => {
      let line = `  ${field.name} ${field.type}`;
      
      // Add PRIMARY KEY constraint if field is a primary key
      if (field.isPrimaryKey) {
        line += ' PRIMARY KEY';
      }
      
      // Add NOT NULL constraint if field cannot be null
      if (field.isNotNull && !line.includes('NOT NULL')) {
        line += ' NOT NULL';
      }
      
      // Add UNIQUE constraint if field must be unique
      if (field.isUnique && !line.includes('UNIQUE')) {
        line += ' UNIQUE';
      }
      
      // Add DEFAULT value if specified
      if (field.defaultValue && !line.includes('DEFAULT')) {
        line += ` DEFAULT ${field.defaultValue}`;
      }
      
      return line;
    });
    
    // Add field definitions
    schema += fieldLines.join(',\n');
    
    // Add foreign key constraints
    const foreignKeyRelationships = relationships.filter(rel => 
      rel.targetEntityId === entity.id
    );
    
    if (foreignKeyRelationships.length > 0) {
      schema += ',\n';
      
      const fkLines = foreignKeyRelationships.map(rel => {
        const sourceEntity = entities.find(e => e.id === rel.sourceEntityId);
        const sourceField = sourceEntity?.fields.find(f => f.id === rel.sourceFieldId);
        const targetField = entity.fields.find(f => f.id === rel.targetFieldId);
        
        if (sourceEntity && sourceField && targetField) {
          return `  FOREIGN KEY (${targetField.name}) REFERENCES ${sourceEntity.name}(${sourceField.name})` + 
                (dbType.toLowerCase() === 'mysql' ? ' ON DELETE CASCADE' : '');
        }
        return '';
      }).filter(line => line.length > 0);
      
      schema += fkLines.join(',\n');
    }
    
    schema += '\n);\n\n';
  }
  
  // Create indexes for foreign keys (optional enhancement)
  for (const entity of entities) {
    const foreignKeyFields = entity.fields.filter(f => f.isForeignKey);
    
    if (foreignKeyFields.length > 0) {
      for (const field of foreignKeyFields) {
        schema += `CREATE INDEX idx_${entity.name.toLowerCase()}_${field.name} ON ${entity.name}(${field.name});\n`;
      }
      schema += '\n';
    }
  }
  
  return schema;
}
