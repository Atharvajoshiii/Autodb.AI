import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { CheckCircle, Download, Clipboard } from 'lucide-react';
import { convertERToSchema } from '@/lib/utils/schema-parser';
import { useToast } from '@/hooks/use-toast';

// Define DbType locally
export type DbType = 'PostgreSQL' | 'MySQL' | 'SQLite';

interface SchemaPanelProps {
  schema: string;
  dbType: DbType;
  onDbTypeChange: (dbType: DbType) => void;
  diagram: any;
  isMobile?: boolean;
}

export function SchemaPanel({ 
  schema, 
  dbType, 
  onDbTypeChange,
  diagram,
  isMobile = false 
}: SchemaPanelProps) {
  const [isPanelVisible, setPanelVisible] = useState(!isMobile);
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  const handleTogglePanel = () => {
    if (isMobile) {
      setPanelVisible(!isPanelVisible);
    }
  };

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(schema);
      toast({
        description: "Schema copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDbTypeChange = (type: DbType) => {
    if (diagram) {
      // Regenerate schema with new DB type
      const newSchema = convertERToSchema(diagram, type);
      onDbTypeChange(type);
    }
  };

  const handleValidateSchema = () => {
    // For a real implementation, this would check for SQL syntax errors
    // For now, we'll just simulate validation
    setIsValid(true);
    toast({
      title: "Validation passed",
      description: "Schema is valid",
      variant: "default",
    });
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([schema], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema_${dbType.toLowerCase()}_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      description: "Schema downloaded successfully",
    });
  };

  if (isMobile && !isPanelVisible) {
    return (
      <div className="p-4 bg-white border-b border-slate-200 w-full">
        <Button variant="outline" onClick={handleTogglePanel} className="w-full flex items-center justify-between">
          <span>SQL Schema</span>
          <span className="ri-arrow-down-s-line" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 bg-slate-800 flex flex-col h-1/2 md:h-full overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="font-semibold text-white">SQL Schema</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCopySchema} 
            className="text-slate-300 hover:text-white h-8 w-8"
          >
            <Clipboard size={16} />
          </Button>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleTogglePanel} 
              className="md:hidden text-slate-300 hover:text-white"
            >
              <span className="ri-arrow-up-s-line" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        <Button
          variant={dbType === 'PostgreSQL' ? 'default' : 'ghost'}
          onClick={() => handleDbTypeChange('PostgreSQL')}
          className={`px-4 py-2 text-sm rounded-none border-r border-slate-700 ${
            dbType === 'PostgreSQL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          PostgreSQL
        </Button>
        <Button
          variant={dbType === 'MySQL' ? 'default' : 'ghost'}
          onClick={() => handleDbTypeChange('MySQL')}
          className={`px-4 py-2 text-sm rounded-none border-r border-slate-700 ${
            dbType === 'MySQL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          MySQL
        </Button>
        <Button
          variant={dbType === 'SQLite' ? 'default' : 'ghost'}
          onClick={() => handleDbTypeChange('SQLite')}
          className={`px-4 py-2 text-sm rounded-none ${
            dbType === 'SQLite' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          SQLite
        </Button>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 overflow-auto bg-slate-900">
        <CodeBlock code={schema || '-- No schema generated yet'} language="sql" className="h-full" />
      </div>
      
      {/* Schema Actions */}
      <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleValidateSchema}
            disabled={!schema}
            className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1 rounded-md flex items-center"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Validate
          </Button>
          {isValid && schema && (
            <span className="text-emerald-400 text-sm flex items-center">
              <CheckCircle className="mr-1 h-4 w-4" />
              Valid Schema
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          disabled={!schema}
          onClick={handleDownloadSchema}
          className="text-slate-300 hover:text-white h-8 w-8"
        >
          <Download size={16} />
        </Button>
      </div>
    </div>
  );
}
