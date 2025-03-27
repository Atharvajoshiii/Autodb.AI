import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypeAnimation } from 'react-type-animation';
import { 
  UserIcon, 
  MailIcon, 
  LockIcon, 
  ShoppingCartIcon, 
  HeartPulseIcon, 
  WalletIcon, 
  NetworkIcon 
} from 'lucide-react';

// Define interface for Database Type
interface DatabaseType {
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  goalTemplate: (name: string) => string;
  backgroundColor: string;
  gradientBackground: string;
  illustrationContent: React.ReactNode;
}

const AutoDBSignup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [databaseGoal, setDatabaseGoal] = useState<string>('');
  const [key, setKey] = useState(0);

  const databaseTypes: DatabaseType[] = [
    { 
      name: 'E-commerce', 
      icon: <ShoppingCartIcon className="w-16 h-16 text-emerald-600" />, 
      description: 'Optimized for online retail management',
      details: [
        'Product Catalog Management',
        'Customer Order Tracking',
        'Inventory Optimization',
        'Sales Analytics'
      ],
      goalTemplate: (name) => `Perfect! Setting up an E-commerce Database for ${name}'s online store...`,
      backgroundColor: 'bg-emerald-50',
      gradientBackground: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
      illustrationContent: (
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-emerald-100 p-4 rounded-xl">
            <ShoppingCartIcon className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="bg-emerald-100 p-4 rounded-xl">
            <WalletIcon className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
      )
    },
    { 
      name: 'Healthcare', 
      icon: <HeartPulseIcon className="w-16 h-16 text-red-600" />, 
      description: 'Secure patient data management',
      details: [
        'Patient Record Tracking',
        'Appointment Scheduling',
        'Medical History Management',
        'Prescription Tracking'
      ],
      goalTemplate: (name) => `Great choice! ${name}'s Healthcare DB is loading securely...`,
      backgroundColor: 'bg-red-50',
      gradientBackground: 'bg-gradient-to-br from-red-100 to-red-200',
      illustrationContent: (
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-red-100 p-4 rounded-xl">
            <HeartPulseIcon className="w-12 h-12 text-red-600" />
          </div>
          <div className="bg-red-100 p-4 rounded-xl">
            <NetworkIcon className="w-12 h-12 text-red-600" />
          </div>
        </div>
      )
    },
    { 
      name: 'Finance', 
      icon: <WalletIcon className="w-16 h-16 text-indigo-600" />, 
      description: 'Robust financial transaction tracking',
      details: [
        'Transaction Logging',
        'Investment Tracking',
        'Risk Management',
        'Financial Reporting'
      ],
      goalTemplate: (name) => `Powering up a robust Financial Database for ${name}'s business...`,
      backgroundColor: 'bg-indigo-50',
      gradientBackground: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
      illustrationContent: (
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-indigo-100 p-4 rounded-xl">
            <WalletIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="bg-indigo-100 p-4 rounded-xl">
            <NetworkIcon className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
      )
    },
    { 
      name: 'Social Media', 
      icon: <NetworkIcon className="w-16 h-16 text-purple-600" />, 
      description: 'Scalable user interaction tracking',
      details: [
        'User Profile Management',
        'Content Tracking',
        'Social Interaction Logging',
        'Engagement Analytics'
      ],
      goalTemplate: (name) => `Crafting a dynamic Social Media Database for ${name}'s network...`,
      backgroundColor: 'bg-purple-50',
      gradientBackground: 'bg-gradient-to-br from-purple-100 to-purple-200',
      illustrationContent: (
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-purple-100 p-4 rounded-xl">
            <NetworkIcon className="w-12 h-12 text-purple-600" />
          </div>
          <div className="bg-purple-100 p-4 rounded-xl">
            <UserIcon className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (selectedDatabase) {
      const selectedDbType = databaseTypes.find(db => db.name === selectedDatabase);
      if (selectedDbType) {
        setDatabaseGoal(selectedDbType.goalTemplate(name || 'User'));
        // Force re-render of TypeAnimation
        setKey(prev => prev + 1);
      }
    }
  }, [selectedDatabase, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', { name, email, selectedDatabase });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
        {/* Left Section - Signup Form */}
        <div className="p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-white to-blue-50">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
            {name 
              ? `Hi ${name}, Let's Build Your First Database!` 
              : 'Create Your AutoDB Account'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-emerald-500 transition duration-300 hover:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-emerald-500 transition duration-300 hover:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-emerald-500 transition duration-300 hover:border-emerald-500"
                />
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Choose what you want to start with:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {databaseTypes.map((db) => (
                <Button 
                  key={db.name}
                  type="button"
                  variant={selectedDatabase === db.name ? 'default' : 'outline'}
                  onClick={() => setSelectedDatabase(db.name)}
                  className={`flex items-center space-x-2 transition duration-300 ${
                    selectedDatabase === db.name 
                      ? 'bg-emerald-600 text-white scale-105' 
                      : 'bg-transparent text-emerald-600 border-emerald-600/30 hover:bg-emerald-600/10 hover:scale-105'
                  }`}
                >
                  {db.icon}
                  <span>{db.name}</span>
                </Button>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-[100%] h-10 -ml-[5%] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Right Section - Dynamic Goal Visualization */}
        <div className={`p-12 flex flex-col justify-center items-center space-y-6 text-center relative overflow-hidden transition-all duration-500 ${
          !selectedDatabase 
            ? 'bg-gradient-to-br from-blue-100 to-white' 
            : databaseTypes.find(db => db.name === selectedDatabase)?.gradientBackground || 'bg-white'
        }`}>
          {!selectedDatabase ? (
            <div className="space-y-6 w-full">
              <div className="flex justify-center mb-6">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    <h2 className="text-4xl font-extrabold mb-4">
                      AutoDB Intelligence
                    </h2>
                  </div>
                  <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                    Intelligent database solutions that adapt to your unique business needs. Transform data into actionable insights with our cutting-edge, specialized database platforms.
                  </p>
                  <div className="mt-6 flex justify-center space-x-4">
                    {databaseTypes.map((db) => (
                      <div 
                        key={db.name} 
                        className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-all"
                        onClick={() => setSelectedDatabase(db.name)}
                      >
                        {db.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div className="flex justify-center mb-6">
                {databaseTypes.find(db => db.name === selectedDatabase)?.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedDatabase} Database
              </h2>
              <p className="text-gray-600 mb-6">
                {databaseTypes.find(db => db.name === selectedDatabase)?.description}
              </p>
              
              {/* Unique database details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {databaseTypes.find(db => db.name === selectedDatabase)?.details.map((detail, index) => (
                  <div 
                    key={index} 
                    className="bg-white/50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-700">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Unique illustration */}
              <div className="flex justify-center mb-6">
                {databaseTypes.find(db => db.name === selectedDatabase)?.illustrationContent}
              </div>

              {/* Animated goal text */}
              <div className="text-xl min-h-[100px]">
                <TypeAnimation
                  key={key}
                  sequence={[
                    databaseGoal,
                    1000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={0}
                  style={{ display: 'inline-block', color: databaseTypes.find(db => db.name === selectedDatabase)?.icon.props.className.match(/text-[a-z]+-600/)[0] }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoDBSignup;