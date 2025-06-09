import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  Panel,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Plus, Link, Undo, Redo } from 'lucide-react';
import { convertERDiagramToFlow, convertFlowToERDiagram, createNewEntity } from '@/lib/utils/er-diagram';

// Custom Node Component for Entities
const EntityNode = ({ data, selected }: { data: { entity: Entity }, selected: boolean }) => {
  const { entity } = data;
  
  return (
    <div className={`bg-white rounded-md shadow-md border ${selected ? 'border-blue-500' : 'border-primary'} w-[200px] cursor-move`}>
      <div className="bg-primary text-white p-2 rounded-t-md font-medium text-center">
        {entity.name}
      </div>
      <div className="p-2 text-sm">
        {entity.fields.map((field) => (
          <div key={field.id} className="py-1 flex items-center">
            {field.isPrimaryKey && <span className="ri-key-line mr-1 text-amber-500" />}
            {field.isForeignKey && <span className="ri-link mr-1 text-blue-500" />}
            <span className="font-mono">{field.name} ({field.type})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define node types
const nodeTypes: NodeTypes = {
  entityNode: EntityNode,
};

interface DiagramPanelProps {
  diagram: ERDiagram | null;
  onChange: (diagram: ERDiagram) => void;
  onEntityEdit: (entity: Entity) => void;
  onAddRelationship: () => void;
  isMobile?: boolean;
}

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

export function DiagramPanel({ 
  diagram, 
  onChange, 
  onEntityEdit, 
  onAddRelationship, 
  isMobile = false 
}: DiagramPanelProps) {
  const [isPanelVisible, setPanelVisible] = useState(!isMobile);
  const [undoStack, setUndoStack] = useState<ERDiagram[]>([]);
  const [redoStack, setRedoStack] = useState<ERDiagram[]>([]);
  const flowInstance = useReactFlow();
  
  const { nodes = [], edges = [] } = diagram
    ? convertERDiagramToFlow(diagram)
    : { nodes: [], edges: [] };
  
  const handleTogglePanel = () => {
    if (isMobile) {
      setPanelVisible(!isPanelVisible);
    }
  };
  
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const entity = node.data.entity;
    if (entity) {
      onEntityEdit(entity);
    }
  }, [onEntityEdit]);
  
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    if (!diagram) return;
    
    // Save current state to undo stack before making changes
    const nodesWithNewPositions = flowInstance.getNodes().map(node => {
      const change = changes.find(c => 'id' in c && c.id === node.id && c.type === 'position');
      if (change && 'position' in change && change.position) {
        return {
          ...node,
          position: change.position,
        };
      }
      return node;
    });
    
    // Ensure all node positions are defined
    const validNodes = nodesWithNewPositions.filter(n => n.position);
    const newDiagram = convertFlowToERDiagram(validNodes as Node[], flowInstance.getEdges()) as ERDiagram;
    onChange(newDiagram);
  }, [diagram, flowInstance, onChange]);
  
  const handleAddEntity = useCallback(() => {
    if (!diagram) return;
    
    // Create new entity at a default position
    const newEntity = createNewEntity('NewEntity', { x: 250, y: 250 });
    
    // Add to diagram
    const newDiagram: ERDiagram = {
      entities: [...diagram.entities, newEntity],
      relationships: [...diagram.relationships]
    };
    
    // Save current state to undo stack
    setUndoStack([...undoStack, diagram]);
    setRedoStack([]);
    
    // Update the diagram
    onChange(newDiagram);
    
    // Open entity editor for the new entity
    onEntityEdit(newEntity);
  }, [diagram, undoStack, onChange, onEntityEdit]);
  
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !diagram) return;
    
    // Pop the last state from the undo stack
    const newUndoStack = [...undoStack];
    const previousDiagram = newUndoStack.pop();
    
    // Push current state to redo stack
    setRedoStack([...redoStack, diagram]);
    setUndoStack(newUndoStack);
    
    // Restore previous state
    if (previousDiagram) {
      onChange(previousDiagram);
    }
  }, [undoStack, redoStack, diagram, onChange]);
  
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    // Pop the last state from the redo stack
    const newRedoStack = [...redoStack];
    const nextDiagram = newRedoStack.pop();
    
    // Push current state to undo stack if it exists
    if (diagram) {
      setUndoStack([...undoStack, diagram]);
    }
    setRedoStack(newRedoStack);
    
    // Restore next state
    if (nextDiagram) {
      onChange(nextDiagram);
    }
  }, [undoStack, redoStack, diagram, onChange]);
  
  const handleZoomIn = () => {
    flowInstance.zoomIn();
  };
  
  const handleZoomOut = () => {
    flowInstance.zoomOut();
  };
  
  const handleZoomReset = () => {
    flowInstance.fitView();
  };
  
  if (isMobile && !isPanelVisible) {
    return (
      <div className="p-4 bg-white border-b border-slate-200 w-full">
        <Button variant="outline" onClick={handleTogglePanel} className="w-full flex items-center justify-between">
          <span>ER Diagram</span>
          <span className="ri-arrow-down-s-line" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full md:flex-1 bg-slate-50 flex flex-col h-1/2 md:h-full overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">ER Diagram</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 rounded-md p-1">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In" className="p-1 hover:bg-slate-200 rounded h-8 w-8">
              <ZoomIn size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out" className="p-1 hover:bg-slate-200 rounded h-8 w-8">
              <ZoomOut size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomReset} title="Reset Zoom" className="p-1 hover:bg-slate-200 rounded h-8 w-8">
              <Maximize size={16} />
            </Button>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={handleTogglePanel} className="md:hidden">
              <span className="ri-arrow-up-s-line" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Diagram Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls showInteractive={false} position="bottom-right" />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-white border border-slate-200 rounded-sm shadow-sm"
            nodeBorderRadius={2}
          />
        </ReactFlow>
        
        {(!diagram || diagram.entities.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col">
            <span className="ri-database-2-line text-5xl mb-2" />
            <p>Generate a database schema or drag elements to build your diagram</p>
          </div>
        )}
      </div>
      
      {/* Diagram Toolbar */}
      <div className="p-2 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAddEntity} 
            className="p-1 text-sm text-slate-600 hover:bg-slate-100 rounded flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Entity
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAddRelationship} 
            className="p-1 text-sm text-slate-600 hover:bg-slate-100 rounded flex items-center"
          >
            <Link size={16} className="mr-1" />
            Add Relation
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUndo} 
            disabled={undoStack.length === 0} 
            className="p-1 text-slate-600 hover:bg-slate-100 rounded h-8 w-8"
          >
            <Undo size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRedo} 
            disabled={redoStack.length === 0} 
            className="p-1 text-slate-600 hover:bg-slate-100 rounded h-8 w-8"
          >
            <Redo size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export function DiagramPanelWithProvider(props: DiagramPanelProps) {
  return (
    <ReactFlowProvider>
      <DiagramPanel {...props} />
    </ReactFlowProvider>
  );
}
