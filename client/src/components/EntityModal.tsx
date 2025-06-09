import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Field, Entity, DatabaseSchema } from "@/types/er";

interface EntityModalProps {
  schema: DatabaseSchema;
  entityId: string | null;
  addField?: boolean;
  onClose: () => void;
  onSave: (entity: Entity) => void;
}

export default function EntityModal({ 
  schema, 
  entityId, 
  addField = false,
  onClose, 
  onSave 
}: EntityModalProps) {
  const [entity, setEntity] = useState<Entity>({
    id: '',
    name: '',
    fields: [],
    position: { x: 100, y: 100 }
  });

  // Data type options
  const dataTypes = [
    { value: "INT", label: "INT" },
    { value: "VARCHAR(255)", label: "VARCHAR" },
    { value: "TEXT", label: "TEXT" },
    { value: "BOOLEAN", label: "BOOLEAN" },
    { value: "DATE", label: "DATE" },
    { value: "TIMESTAMP", label: "TIMESTAMP" },
    { value: "DECIMAL(10,2)", label: "DECIMAL" },
    { value: "FLOAT", label: "FLOAT" },
  ];

  // Find the entity to edit
  useEffect(() => {
    if (entityId) {
      const foundEntity = schema.entities.find(e => e.id === entityId);
      if (foundEntity) {
        setEntity(foundEntity);
        
        // If addField is true, add an empty field
        if (addField) {
          const newField: Field = {
            id: uuidv4(),
            name: '',
            type: 'VARCHAR(255)',
            isPrimaryKey: false,
            isForeignKey: false,
            isNotNull: false,
            isUnique: false
          };
          
          setEntity(prev => ({
            ...prev,
            fields: [...prev.fields, newField]
          }));
        }
      }
    } else {
      // Create a new entity with default values
      const newEntity: Entity = {
        id: uuidv4(),
        name: '',
        fields: [
          {
            id: uuidv4(),
            name: 'id',
            type: 'INT',
            isPrimaryKey: true,
            isForeignKey: false,
            isNotNull: true,
            isUnique: true
          }
        ],
        position: {
          x: Math.random() * 300 + 50,
          y: Math.random() * 300 + 50
        }
      };
      
      setEntity(newEntity);
    }
  }, [entityId, schema.entities, addField]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntity({
      ...entity,
      name: e.target.value
    });
  };

  const handleFieldChange = (fieldId: string, property: keyof Field, value: any) => {
    setEntity({
      ...entity,
      fields: entity.fields.map(field => {
        if (field.id === fieldId) {
          return {
            ...field,
            [property]: value
          };
        }
        return field;
      })
    });
  };

  const handleAddField = () => {
    const newField: Field = {
      id: uuidv4(),
      name: '',
      type: 'VARCHAR(255)',
      isPrimaryKey: false,
      isForeignKey: false,
      isNotNull: false,
      isUnique: false
    };
    
    setEntity({
      ...entity,
      fields: [...entity.fields, newField]
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (entity.fields.length <= 1) {
      // Don't allow deleting all fields
      return;
    }
    
    setEntity({
      ...entity,
      fields: entity.fields.filter(field => field.id !== fieldId)
    });
  };

  const handleSave = () => {
    // Validate
    if (!entity.name.trim()) {
      alert("Entity name is required");
      return;
    }
    
    // Check for at least one field
    if (entity.fields.length === 0) {
      alert("Entity must have at least one field");
      return;
    }
    
    // Check for field names
    for (const field of entity.fields) {
      if (!field.name.trim()) {
        alert("All fields must have names");
        return;
      }
    }
    
    // Check for primary key
    if (!entity.fields.some(field => field.isPrimaryKey)) {
      alert("Entity must have at least one primary key");
      return;
    }
    
    onSave(entity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-neutral-900">
            {entityId ? "Edit Entity" : "Add Entity"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <Label htmlFor="entity-name" className="block text-sm font-medium text-neutral-700 mb-1">
              Entity Name
            </Label>
            <Input
              id="entity-name"
              value={entity.name}
              onChange={handleNameChange}
              placeholder="e.g., users, products, orders"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Fields
            </Label>
            <div className="border border-neutral-200 rounded-md overflow-hidden">
              {entity.fields.map((field, index) => (
                <div key={field.id} className="p-3 flex items-center border-b border-neutral-100">
                  <div className="flex-grow grid grid-cols-4 gap-2">
                    <Input
                      className="col-span-1 text-sm"
                      value={field.name}
                      onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                      placeholder="Field name"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleFieldChange(field.id, 'type', value)}
                    >
                      <SelectTrigger className="col-span-1 h-9 text-sm">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`pk-${field.id}`}
                          checked={field.isPrimaryKey}
                          onCheckedChange={(checked) => 
                            handleFieldChange(field.id, 'isPrimaryKey', Boolean(checked))
                          }
                        />
                        <Label htmlFor={`pk-${field.id}`} className="text-xs">PK</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`fk-${field.id}`}
                          checked={field.isForeignKey}
                          onCheckedChange={(checked) => 
                            handleFieldChange(field.id, 'isForeignKey', Boolean(checked))
                          }
                        />
                        <Label htmlFor={`fk-${field.id}`} className="text-xs">FK</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`nn-${field.id}`}
                          checked={field.isNotNull}
                          onCheckedChange={(checked) => 
                            handleFieldChange(field.id, 'isNotNull', Boolean(checked))
                          }
                        />
                        <Label htmlFor={`nn-${field.id}`} className="text-xs">NOT NULL</Label>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteField(field.id)}
                    className="ml-2 text-neutral-400 hover:text-destructive"
                    disabled={entity.fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full py-2 text-primary hover:bg-primary-50 text-sm flex items-center justify-center"
                onClick={handleAddField}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Field
              </Button>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-neutral-50 rounded-b-lg flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
