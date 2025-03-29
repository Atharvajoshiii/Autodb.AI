import { FeatureSteps } from "@/components/ui/feature-steps"

const features = [
  { 
    step: 'Intelligence Layer', 
    title: 'AI-Powered Schema Generation',
    content: 'Leverage advanced machine learning algorithms to transform natural language descriptions into precise, optimized database schemas. Our AI understands context, relationships, and best practices to generate intelligent database structures automatically.', 
    image: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-sql-illustration_23-2149242071.jpg' 
  },
  { 
    step: 'Design Flexibility',
    title: 'Intuitive Visual Editor',
    content: 'Experience a powerful drag-and-drop interface that allows you to visualize, modify, and customize your database schemas in real-time. Instantly add, remove, or restructure tables and relationships with unprecedented ease and precision.', 
    image: 'https://media.istockphoto.com/id/887814862/vector/web-design-browser.jpg?s=612x612&w=0&k=20&c=rRNW4h-qjNv3OzhnYFrx03MfBQCwGreRsJsjx_-Kp-Q='
  },
  { 
    step: 'Integration Ecosystem',
    title: 'Multi-Format Schema Export',
    content: 'Seamlessly export your database schemas in multiple industry-standard formats including SQL, JSON, and XML. Designed for smooth integration with popular development frameworks and database management systems.', 
    image: 'https://media.istockphoto.com/id/1303715147/vector/organized-archive-searching-files-in-database-records-management-records-and-information.jpg?s=612x612&w=0&k=20&c=S5Pyxu6Y3YAS9Z3UN7Y28h74T-r2d8YX0Rsi7dxr_OA='
  },
  { 
    step: 'Productivity Accelerator',
    title: 'Intelligent Query Generation',
    content: 'Automatically generate optimized SQL queries based on your schema. Our AI analyzes table structures, identifies potential performance bottlenecks, and suggests efficient query patterns to enhance database performance.', 
    image: 'https://img.freepik.com/vecteurs-libre/illustration-hebergement-site-web-degrade_23-2149266855.jpg'
  },
]

export function FeatureStepsDemo() {
  return (
    <div id="features" className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute blur-xl bg-gray-200 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              borderRadius: '50%',
              transform: `scale(${Math.random() * 0.8 + 0.2})`,
              animation: `float ${Math.random() * 20 + 20}s infinite alternate ease-in-out`,
              animationDelay: `-${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgaWQ9InBhdHRlcm4tYmFja2dyb3VuZCIgd2lkdGg9IjQwMCUiIGhlaWdodD0iNDAwJSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LDEpIj48L3JlY3Q+PHBhdGggZmlsbD0icmdiYSgwLCAwLCAwLCAwLjAzKSIgZD0iTS0xMCAzMGg2MHYxMGgtNjB6Ij48L3BhdGg+PHBhdGggZmlsbD0icmdiYSgwLCAwLCAwLCAwLjAzKSIgZD0iTS0xMCAwaDYwdjEwaC02MHoiPjwvcGF0aD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjcGF0dGVybikiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiPjwvcmVjdD48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <FeatureSteps 
        features={features}
        title="Revolutionize Your Database Design"
        autoPlayInterval={3000}
        imageHeight="h-[550px]"
        className="relative z-10"
      />

      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) scale(0.8);
          }
          100% {
            transform: translate(50px, 50px) scale(1);
          }
        }
      `}</style>
    </div>
  )
}