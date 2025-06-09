import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';

// Local type definitions
export interface Field {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  constraints: string[];
}

export interface Entity {
  id: string;
  name: string;
  fields: Field[];
  position?: { x: number; y: number };
}

interface FieldEditorProps {
  field: Field;
  onSave: (field: Field) => void;
  onCancel: () => void;
}

function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [name, setName] = useState(field.name);
  const [type, setType] = useState(field.type);
  const [isPrimaryKey, setIsPrimaryKey] = useState(field.isPrimaryKey);
  const [isNotNull, setIsNotNull] = useState(field.constraints.includes('NOT NULL'));
  const [isUnique, setIsUnique] = useState(field.constraints.includes('UNIQUE'));

  const handleSave = () => {
    const constraints = [];
    if (isNotNull) constraints.push('NOT NULL');
    if (isUnique) constraints.push('UNIQUE');
    
    onSave({
      ...field,
      name,
      type,
      isPrimaryKey,
      constraints
    });
  };

  return (
    <div className="border border-slate-200 rounded-md p-4 space-y-4">
      <h4 className="font-medium">Edit Field</h4>
      
      <div className="space-y-2">
        <Label htmlFor="field-name">Field Name</Label>
        <Input 
          id="field-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Field Name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="field-type">Field Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="field-type">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INT">INT</SelectItem>
            <SelectItem value="SERIAL">SERIAL</SelectItem>
            <SelectItem value="VARCHAR(255)">VARCHAR(255)</SelectItem>
            <SelectItem value="TEXT">TEXT</SelectItem>
            <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
            <SelectItem value="DATE">DATE</SelectItem>
            <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
            <SelectItem value="DECIMAL(10,2)">DECIMAL(10,2)</SelectItem>
            <SelectItem value="BIGINT">BIGINT</SelectItem>
            <SelectItem value="SMALLINT">SMALLINT</SelectItem>
            <SelectItem value="FLOAT">FLOAT</SelectItem>
            <SelectItem value="DOUBLE">DOUBLE</SelectItem>
            <SelectItem value="JSON">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Constraints</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="primary-key" 
              checked={isPrimaryKey} 
              onCheckedChange={(checked) => setIsPrimaryKey(checked as boolean)} 
            />
            <Label htmlFor="primary-key">Primary Key</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="not-null" 
              checked={isNotNull} 
              onCheckedChange={(checked) => setIsNotNull(checked as boolean)} 
            />
            <Label htmlFor="not-null">Not Null</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="unique" 
              checked={isUnique} 
              onCheckedChange={(checked) => setIsUnique(checked as boolean)} 
            />
            <Label htmlFor="unique">Unique</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Field
        </Button>
      </div>
    </div>
  );
}

interface EntityEditorModalProps {
  entity: Entity | null;
  open: boolean;
  onClose: () => void;
  onSave: (entity: Entity) => void;
}

export function EntityEditorModal({ entity, open, onClose, onSave }: EntityEditorModalProps) {
  const [editedEntity, setEditedEntity] = useState<Entity | null>(null);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  // Reset edited entity when the input entity changes
  useEffect(() => {
    setEditedEntity(entity ? { ...entity, fields: [...entity.fields] } : null);
    setEditingField(null);
    setIsAddingField(false);
  }, [entity, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedEntity) return;
    setEditedEntity({ ...editedEntity, name: e.target.value });
  };

  const handleSave = () => {
    if (!editedEntity) return;
    onSave(editedEntity);
    onClose();
  };

  const handleAddField = () => {
    setIsAddingField(true);
    setEditingField({
      id: `field-${uuidv4()}`,
      name: '',
      type: 'VARCHAR(255)',
      constraints: [],
      isPrimaryKey: false,
      isForeignKey: false
    });
  };

  const handleEditField = (field: Field) => {
    setEditingField({ ...field });
    setIsAddingField(false);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!editedEntity) return;
    setEditedEntity({
      ...editedEntity,
      fields: editedEntity.fields.filter(f => f.id !== fieldId)
    });
  };

  const handleSaveField = (field: Field) => {
    if (!editedEntity) return;
    
    if (isAddingField) {
      // Add new field
      setEditedEntity({
        ...editedEntity,
        fields: [...editedEntity.fields, field]
      });
    } else {
      // Update existing field
      setEditedEntity({
        ...editedEntity,
        fields: editedEntity.fields.map(f => f.id === field.id ? field : f)
      });
    }
    
    setEditingField(null);
    setIsAddingField(false);
  };

  const handleCancelFieldEdit = () => {
    setEditingField(null);
    setIsAddingField(false);
  };

  if (!editedEntity) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Entity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="entity-name" className="block text-sm font-medium mb-1">
              Entity Name
            </Label>
            <Input
              id="entity-name"
              value={editedEntity.name}
              onChange={handleNameChange}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="block text-sm font-medium">Fields</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddField}
                disabled={!!editingField}
                className="text-sm flex items-center"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Field
              </Button>
            </div>
            
            {editingField ? (
              <FieldEditor 
                field={editingField} 
                onSave={handleSaveField} 
                onCancel={handleCancelFieldEdit} 
              />
            ) : (
              <div className="border border-slate-200 rounded-md">
                {editedEntity.fields.length > 0 ? (
                  editedEntity.fields.map((field, index) => (
                    <div key={field.id} className="p-2 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{field.name}</div>
                        <div className="text-sm text-slate-500">
                          {field.type}
                          {field.isPrimaryKey && ', Primary Key'}
                          {field.constraints.map(c => `, ${c}`).join('')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditField(field)}
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteField(field.id)}
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      {index < editedEntity.fields.length - 1 && <Separator className="absolute left-0 right-0" />}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500">
                    No fields added yet. Click "Add Field" to create one.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
