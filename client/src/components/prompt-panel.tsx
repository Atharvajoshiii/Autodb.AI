import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Wand2 } from 'lucide-react';

export type DbType = 'PostgreSQL' | 'MySQL' | 'SQLite' | 'SQL Server';

export interface Project {
  id: string;
  name: string;
  // Add other fields as needed
}

interface PromptPanelProps {
  onGenerate: (schema: string, diagram: any) => void;
  onLoading: (loading: boolean) => void;
  isMobile?: boolean;
  recentProjects: Project[];
  onProjectSelect: (project: Project) => void;
}

export function PromptPanel({ 
  onGenerate, 
  onLoading,
  isMobile = false,
  recentProjects,
  onProjectSelect
}: PromptPanelProps) {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('My Database Project');
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dbType, setDbType] = useState<DbType>('PostgreSQL');
  const [includeConstraints, setIncludeConstraints] = useState(true);
  const [includeSampleData, setIncludeSampleData] = useState(false);
  const [isPanelVisible, setPanelVisible] = useState(!isMobile);

  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleTogglePanel = () => {
    if (isMobile) {
      setPanelVisible(!isPanelVisible);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a database description",
        variant: "destructive"
      });
      return;
    }

    onLoading(true);

    try {
      const response = await apiRequest('POST', '/api/generate', {
        prompt,
        dbType,
        includeConstraints,
        includeSampleData
      });

      const data = await response.json();
      onGenerate(data.schema, data.diagram);
      
      toast({
        title: "Success",
        description: "Database schema generated successfully"
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "An error occurred while generating the schema",
        variant: "destructive"
      });
    } finally {
      onLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    onProjectSelect(project);
  };

  if (isMobile && !isPanelVisible) {
    return (
      <div className="p-4 bg-white border-b border-slate-200 w-full">
        <Button variant="outline" onClick={handleTogglePanel} className="w-full flex items-center justify-between">
          <span>Database Prompt</span>
          <span className="ri-arrow-down-s-line" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Database Prompt</h2>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={handleTogglePanel} className="md:hidden">
            <span className="ri-arrow-up-s-line" />
          </Button>
        )}
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <Label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-1">
            Project Name
          </Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full"
            placeholder="My Database Project"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">
            Describe Your Database
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="w-full"
            placeholder="Create a database for an e-commerce application with products, categories, customers, orders, and payments..."
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-500">AI Model: Anthropic Claude</div>
          <div>
            <Button 
              variant="link" 
              onClick={toggleAdvancedOptions} 
              className="text-sm text-primary p-0 h-auto flex items-center"
            >
              Advanced Options
              <span className={`ml-1 ${showAdvanced ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
            </Button>
          </div>
        </div>
        
        {showAdvanced && (
          <div className="bg-slate-50 p-3 rounded-md mb-4 text-sm">
            <div className="mb-3">
              <Label htmlFor="dbType" className="block text-slate-700 mb-1">
                Database Type
              </Label>
              <Select value={dbType} onValueChange={(value: DbType) => setDbType(value)}>
                <SelectTrigger id="dbType" className="w-full">
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                  <SelectItem value="MySQL">MySQL</SelectItem>
                  <SelectItem value="SQLite">SQLite</SelectItem>
                  <SelectItem value="SQL Server">SQL Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-3 flex items-center space-x-2">
              <Checkbox 
                id="constraints" 
                checked={includeConstraints} 
                onCheckedChange={(checked) => setIncludeConstraints(checked as boolean)}
              />
              <Label htmlFor="constraints" className="text-slate-700">
                Include indexes and constraints
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sampleData" 
                checked={includeSampleData} 
                onCheckedChange={(checked) => setIncludeSampleData(checked as boolean)}
              />
              <Label htmlFor="sampleData" className="text-slate-700">
                Include sample data
              </Label>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full bg-primary hover:bg-blue-600 text-white font-medium" 
          onClick={handleGenerate}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Database
        </Button>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <h3 className="font-medium text-slate-700 mb-2 text-sm">Recent Projects</h3>
        <ul className="text-sm space-y-1">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <li 
                key={project.id} 
                onClick={() => handleProjectClick(project)}
                className="flex items-center justify-between hover:bg-slate-100 p-1 rounded cursor-pointer"
              >
                <span className="truncate">{project.name}</span>
                <span className="ri-arrow-right-s-line text-slate-400" />
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">No recent projects</li>
          )}
        </ul>
      </div>
    </div>
  );
}
