import React, { useState, useEffect } from "react"
import { LogOut, Plus, Database, Globe, Settings, ChevronRight, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample project data with additional metadata
const projects = [
  {
    id: 1,
    name: "Marketing Website DB",
    description: "Comprehensive schema for company marketing website",
    createdAt: "2023-10-15",
    type: "Web",
    complexity: "Medium",
    tables: 12,
    iconColor: "from-cyan-400 to-blue-500"
  },
  {
    id: 2,
    name: "E-commerce Platform Schema",
    description: "Robust database design for online store ecosystem",
    createdAt: "2023-11-02",
    type: "Commerce",
    complexity: "High",
    tables: 25,
    iconColor: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    name: "Mobile App Backend",
    description: "Optimized database architecture for mobile services",
    createdAt: "2023-12-10",
    type: "Mobile",
    complexity: "Low",
    tables: 8,
    iconColor: "from-green-400 to-emerald-500"
  },
  {
    id: 4,
    name: "Analytics Dashboard DB",
    description: "Scalable data model for advanced reporting",
    createdAt: "2024-01-05",
    type: "Analytics",
    complexity: "High",
    tables: 18,
    iconColor: "from-indigo-500 to-purple-600"
  },
  {
    id: 5,
    name: "Customer Portal Schema",
    description: "Secure and flexible database for client management",
    createdAt: "2024-02-18",
    type: "CRM",
    complexity: "Medium",
    tables: 15,
    iconColor: "from-orange-400 to-amber-500"
  },
  {
    id: 6,
    name: "Internal Tools Database",
    description: "Comprehensive schema for organizational tooling",
    createdAt: "2024-03-22",
    type: "Internal",
    complexity: "Low",
    tables: 10,
    iconColor: "from-teal-400 to-cyan-500"
  }
]

export default function AutoDBDashboard() {
  const [activeSection, setActiveSection] = useState("projects")
  const [animateProjects, setAnimateProjects] = useState(false)

  // Trigger animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateProjects(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined)
  }

  // Complexity color mapping
  const getComplexityColor = (complexity : string) => {
    switch(complexity) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        {/* Elegant Sidebar */}
        <div className="w-64 bg-white border-r shadow-2xl flex flex-col">
          {/* AutoDB Logo Section */}
          <div className="p-6 border-b flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 shadow-lg transform hover:scale-110 transition-transform">
              <Database className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AutoDB</span>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 py-6 px-4 space-y-2">
            <button
              onClick={() => setActiveSection("projects")}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                ${activeSection === "projects" 
                  ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-md" 
                  : "hover:bg-gray-100 text-gray-600 hover:shadow-sm"}
              `}
            >
              <Globe className="h-5 w-5" />
              <span className="font-medium">My Schemas</span>
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                ${activeSection === "settings" 
                  ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 shadow-md" 
                  : "hover:bg-gray-100 text-gray-600 hover:shadow-sm"}
              `}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          {/* User Profile and Logout Section */}
          <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Profile"
                  className="h-12 w-12 rounded-full ring-4 ring-blue-500/30 object-cover transform hover:scale-110 transition-transform"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400 animate-pulse"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 truncate">Alex Johnson</p>
                <p className="text-xs text-gray-500 truncate">@alex_autodb</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all hover:rotate-180">
                    <LogOut className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  Database Schemas
                </h1>
                <p className="text-gray-500 text-lg">Explore and manage your database designs</p>
              </div>
              <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <Plus className="h-4 w-4" />
                <span>New Schema</span>
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`
                    transform transition-all duration-700 ease-in-out
                    ${animateProjects ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl group overflow-hidden relative transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-lg">
                    {/* Gradient Background Layer */}
                    <div 
                      className={`absolute inset-0 opacity-10 bg-gradient-to-br ${project.iconColor}`}
                    ></div>

                    <CardHeader className="pb-3 relative z-10">
                      <div className="absolute top-3 right-3">
                        {/* <Badge 
                          className={`${getComplexityColor(project.complexity)} text-xs px-2 py-1 rounded-full shadow-md`}
                        >
                          {project.complexity} Complexity
                        </Badge> */}
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${project.iconColor} shadow-md`}>
                          <Layers className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">
                          {project.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm text-gray-500">
                        Created {formatDate(project.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-0 relative z-10">
                      <p className="text-sm text-gray-600 mb-3 italic">{project.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4" />
                          <span>{project.tables} Tables</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <span>{project.type}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3 relative z-10">
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-transparent bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 hover:from-blue-100 hover:to-purple-100 group-hover:border-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 hover:text-white transition-all transform hover:scale-[1.02]"
                      >
                        View Schema
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}