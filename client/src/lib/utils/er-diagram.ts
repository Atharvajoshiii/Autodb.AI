// Local type definitions
export interface Field {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNotNull?: boolean;
  isUnique?: boolean;
  defaultValue?: string | null;
  constraints?: string[];
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

export interface ERDiagram {
  entities: Entity[];
  relationships: Relationship[];
}

import { Node, Edge, Position, MarkerType } from 'reactflow';

/**
 * Converts an ER diagram to React Flow nodes and edges
 * @param diagram The ER diagram to convert
 * @returns React Flow nodes and edges
 */
export function convertERDiagramToFlow(diagram: ERDiagram): { nodes: Node[], edges: Edge[] } {
  const { entities, relationships } = diagram;
  
  // Create nodes
  const nodes: Node[] = entities.map(entity => ({
    id: entity.id,
    type: 'entityNode',
    position: entity.position,
    data: { entity }
  }));
  
  // Create edges
  const edges: Edge[] = relationships.map(relationship => {
    const sourceEntity = entities.find(e => e.id === relationship.sourceEntityId);
    const targetEntity = entities.find(e => e.id === relationship.targetEntityId);
    
    const sourcePosition = Position.Right;
    const targetPosition = Position.Left;
    
    // Determine edge style based on relationship type
    let markerEnd = { type: MarkerType.ArrowClosed };
    let style = {};
    
    if (relationship.type === 'one-to-many') {
      markerEnd = { type: MarkerType.ArrowClosed };
      style = { strokeWidth: 2 };
    } else if (relationship.type === 'many-to-many') {
      markerEnd = { type: MarkerType.ArrowClosed };
      style = { strokeWidth: 2, strokeDasharray: '5,5' };
    }
    
    return {
      id: relationship.id,
      source: relationship.sourceEntityId,
      target: relationship.targetEntityId,
      sourceHandle: relationship.sourceFieldId,
      targetHandle: relationship.targetFieldId,
      type: 'smoothstep',
      animated: false,
      markerEnd,
      style,
      data: { relationship }
    } as Edge;
  });
  
  return { nodes, edges };
}

/**
 * Converts React Flow nodes and edges to an ER diagram
 * @param nodes React Flow nodes
 * @param edges React Flow edges
 * @returns An ER diagram representation
 */
export function convertFlowToERDiagram(nodes: Node[], edges: Edge[]): ERDiagram {
  // Extract entities from nodes
  const entities: Entity[] = nodes.map(node => {
    const entityData = node.data.entity;
    return {
      ...entityData,
      position: node.position
    };
  });
  
  // Extract relationships from edges
  const relationships: Relationship[] = edges.map(edge => {
    return edge.data.relationship;
  });
  
  return { entities, relationships };
}

/**
 * Automatically layouts an ER diagram to reduce overlap
 * @param diagram The ER diagram to layout
 * @returns A new ER diagram with improved layout
 */
export function autoLayout(diagram: ERDiagram): ERDiagram {
  const { entities, relationships } = diagram;
  
  // Simple grid layout (can be replaced with more advanced algorithms)
  const gridCols = Math.ceil(Math.sqrt(entities.length));
  const cellWidth = 300;
  const cellHeight = 250;
  
  const positionedEntities = entities.map((entity, index) => {
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    
    return {
      ...entity,
      position: {
        x: 100 + col * cellWidth,
        y: 100 + row * cellHeight
      }
    };
  });
  
  return {
    entities: positionedEntities,
    relationships
  };
}

/**
 * Creates a new entity for the ER diagram
 * @param name The name of the entity
 * @param position The position of the entity
 * @returns A new entity object
 */
export function createNewEntity(name: string, position: { x: number, y: number }): Entity {
  return {
    id: `entity-${Date.now()}`,
    name,
    position,
    fields: [
      {
        id: `field-${Date.now()}-0`,
        name: 'id',
        type: 'SERIAL',
        constraints: ['PRIMARY KEY'],
        isPrimaryKey: true,
        isForeignKey: false
      }
    ]
  };
}

/**
 * Creates a new field for an entity
 * @param entityId The ID of the entity
 * @param name The field name
 * @param type The field type
 * @param constraints The field constraints
 * @param isPrimaryKey Whether the field is a primary key
 * @returns A new field object
 */
export function createNewField(
  entityId: string,
  name: string,
  type: string,
  constraints: string[] = [],
  isPrimaryKey: boolean = false
): Field {
  return {
    id: `${entityId}-field-${Date.now()}`,
    name,
    type,
    constraints,
    isPrimaryKey,
    isForeignKey: false
  };
}

/**
 * Creates a new relationship between entities
 * @param sourceEntityId The source entity ID
 * @param targetEntityId The target entity ID
 * @param sourceFieldId The source field
 * @param targetFieldId The target field
 * @param type The relationship type
 * @returns A new relationship object
 */
export function createNewRelationship(
  sourceEntityId: string,
  targetEntityId: string,
  sourceFieldId: string,
  targetFieldId: string,
  type: string
): Relationship {
  return {
    id: `relationship-${Date.now()}`,
    sourceEntityId,
    sourceFieldId,
    targetEntityId,
    targetFieldId,
    type
  };
}
