import React, { useState, useEffect } from 'react';
// Make sure to install these packages by running:
// npm install recharts lucide-react
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplet, AlertTriangle, Wind, Thermometer, Activity, Camera, MapPin, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

const SmartRiverfrontDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sensorData, setSensorData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [wasteData, setWasteData] = useState([]);

  // Simulate real-time sensor data
  useEffect(() => {
    const generateSensorData = () => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'});
      return {
        time,
        ph: (7 + Math.random() * 0.5).toFixed(2),
        do: (4 + Math.random() * 2).toFixed(2),
        bod: (25 + Math.random() * 10).toFixed(2),
        turbidity: (40 + Math.random() * 20).toFixed(2),
        temp: (25 + Math.random() * 3).toFixed(1)
      };
    };

    const interval = setInterval(() => {
      setSensorData(prev => {
        const newData = [...prev, generateSensorData()];
        return newData.slice(-20); // Keep the last 20 data points
      });
    }, 3000);

    // Initialize with some data
    const initial = Array.from({ length: 10 }, generateSensorData);
    setSensorData(initial);

    return () => clearInterval(interval);
  }, []);

  // Simulate alerts
  useEffect(() => {
    const alertTypes = [
      { type: 'warning', message: 'BOD levels elevated at Sensor #12', location: 'Riverfront Sector 3' },
      { type: 'critical', message: 'Waste accumulation detected', location: 'Near Gandhi Bridge' },
      { type: 'info', message: 'Water level rising - normal seasonal pattern', location: 'Vasna Barrage' }
    ];

    setAlerts([
      { ...alertTypes[0], time: '2 min ago', id: 1 },
      { ...alertTypes[1], time: '15 min ago', id: 2 },
      { ...alertTypes[2], time: '1 hour ago', id: 3 }
    ]);
  }, []);

  // Waste detection data
  useEffect(() => {
    const wasteLocations = [
      { location: 'Sector 1', plastic: 45, organic: 30, other: 15 },
      { location: 'Sector 2', plastic: 65, organic: 40, other: 25 },
      { location: 'Sector 3', plastic: 30, organic: 20, other: 10 },
      { location: 'Sector 4', plastic: 50, organic: 35, other: 20 },
    ];
    setWasteData(wasteLocations);
  }, []);

  const waterQualityStandards = {
    ph: { min: 6.5, max: 8.5, unit: '' },
    do: { min: 5, max: Infinity, unit: 'mg/L' },
    bod: { min: 0, max: 3, unit: 'mg/L' },
    turbidity: { min: 0, max: 10, unit: 'NTU' }
  };

  const getStatusColor = (value, param) => {
    const std = waterQualityStandards[param];
    if (!std) return 'text-gray-500';
    
    const numValue = parseFloat(value);
    if (param === 'ph') {
      return numValue >= std.min && numValue <= std.max ? 'text-green-500' : 'text-red-500';
    }
    if (param === 'do') {
      return numValue >= std.min ? 'text-green-500' : 'text-red-500';
    }
    return numValue <= std.max ? 'text-green-500' : 'text-red-500';
  };

  const latestData = sensorData[sensorData.length - 1] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Smart Riverfront Management System
          </h1>
          <p className="text-gray-600">Integrated IoT & AI Platform for Sabarmati Riverfront</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">24 Sensors Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">3 Drones Deployed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Real-time Monitoring Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-x-auto">
          <div className="flex border-b">
            {['overview', 'water-quality', 'waste-management', 'flood-prediction', 'safety'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main>
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Real-time Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={<Droplet className="w-8 h-8 text-blue-500" />} title="pH Level" value={latestData.ph} statusColor={getStatusColor(latestData.ph, 'ph')} standard="Standard: 6.5-8.5" />
                <MetricCard icon={<Wind className="w-8 h-8 text-green-500" />} title="Dissolved Oxygen" value={`${latestData.do || '--'} mg/L`} statusColor={getStatusColor(latestData.do, 'do')} standard="Standard: ≥5 mg/L" />
                <MetricCard icon={<Activity className="w-8 h-8 text-orange-500" />} title="BOD" value={`${latestData.bod || '--'} mg/L`} statusColor={getStatusColor(latestData.bod, 'bod')} standard="Standard: ≤3 mg/L" />
                <MetricCard icon={<Thermometer className="w-8 h-8 text-red-500" />} title="Temperature" value={`${latestData.temp || '--'}°C`} statusColor="text-gray-700" standard="Current reading" />
              </div>

              {/* Alerts Panel */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  Active Alerts
                </h2>
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <AlertItem key={alert.id} {...alert} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'water-quality' && (
            <div className="space-y-6 animate-fade-in">
              <ChartCard title="Real-time Water Quality Trends">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ph" stroke="#3b82f6" name="pH" dot={false} />
                    <Line type="monotone" dataKey="do" stroke="#10b981" name="DO (mg/L)" dot={false} />
                    <Line type="monotone" dataKey="bod" stroke="#f59e0b" name="BOD (mg/L)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Sensor Network Status</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(sensor => (
                      <div key={sensor} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Sensor #{sensor}</span>
                        </div>
                        <span className="text-sm text-gray-600">Sector {sensor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ChartCard title="Turbidity Analysis">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sensorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="turbidity" stroke="#8b5cf6" fill="#c4b5fd" name="Turbidity (NTU)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {activeTab === 'waste-management' && (
             <div className="space-y-6 animate-fade-in">
                <ChartCard title="AI-Powered Waste Detection">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wasteData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="plastic" fill="#ef4444" name="Plastic" />
                      <Bar dataKey="organic" fill="#10b981" name="Organic" />
                      <Bar dataKey="other" fill="#6b7280" name="Other" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard icon={<Camera className="w-8 h-8 mb-2" />} title="Plastic Waste Detected (Today)" value="156 kg" bgClass="from-red-500 to-red-600" />
                  <InfoCard icon={<Activity className="w-8 h-8 mb-2" />} title="Robotic Skimmers Active" value="4/5" bgClass="from-green-500 to-green-600" />
                  <InfoCard icon={<TrendingDown className="w-8 h-8 mb-2" />} title="Waste Reduction (This Month)" value="-23%" bgClass="from-blue-500 to-blue-600" />
                </div>
             </div>
          )}
          
          {activeTab === 'flood-prediction' && (
             <div className="space-y-6 animate-fade-in">
                 <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">7-Day Flood Forecast</h2>
                    <p className="text-blue-100">AI-powered hydrological modeling with real-time data integration</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FloodCard title="Current Water Level" value="3.2 m" detail="Normal Range: 2.5-4.0 m" status="Status: Normal" statusBg="bg-green-100" statusText="text-green-800" valueColor="text-blue-600" />
                     <FloodCard title="Predicted Peak" value="4.5 m" detail="Expected: In 72 hours" status="Alert: Monitor Closely" statusBg="bg-yellow-100" statusText="text-yellow-800" valueColor="text-orange-600" />
                     <FloodCard title="Risk Assessment" value="Low" detail="Confidence: 87%" status="Digital Twin Active" statusBg="bg-blue-100" statusText="text-blue-800" valueColor="text-green-600" />
                 </div>
             </div>
          )}

          {activeTab === 'safety' && (
             <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">AI Surveillance Status</h3>
                      <div className="space-y-4">
                         <SafetyStatusItem icon={<Camera className="w-5 h-5 text-green-600" />} title="Crowd Monitoring" status="Active" statusColor="text-green-600" />
                         <SafetyStatusItem icon={<AlertTriangle className="w-5 h-5 text-green-600" />} title="Drowning Detection" status="Active" statusColor="text-green-600" />
                         <SafetyStatusItem icon={<Activity className="w-5 h-5 text-blue-600" />} title="Drone Patrols" status="3 Active" statusColor="text-blue-600" />
                      </div>
                   </div>
                   <div className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Incident Response</h3>
                      <div className="space-y-3">
                         <div className="p-4 bg-gray-50 rounded">
                            <p className="font-semibold text-gray-800">Average Response Time</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">2.3 min</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center"><TrendingDown className="w-4 h-4 mr-1"/> 45% improvement</p>
                         </div>
                         <div className="p-4 bg-gray-50 rounded">
                            <p className="font-semibold text-gray-800">Incidents Today</p>
                            <p className="text-3xl font-bold text-gray-700 mt-2">0</p>
                            <p className="text-sm text-gray-600 mt-1">All systems normal</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};


// Helper Components for better structure and reusability

const MetricCard = ({ icon, title, value, statusColor, standard }) => (
  <div className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-300">
    <div className="flex items-center justify-between mb-2">
      {icon}
      <span className={`text-2xl font-bold ${statusColor}`}>
        {value || '--'}
      </span>
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-xs text-gray-400 mt-1">{standard}</p>
  </div>
);

const AlertItem = ({ type, message, location, time }) => {
  const baseClasses = 'p-4 rounded-lg border-l-4';
  const typeClasses = {
    critical: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-blue-50 border-blue-500'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{message}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

const InfoCard = ({ icon, title, value, bgClass }) => (
  <div className={`bg-gradient-to-br ${bgClass} text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300`}>
    {icon}
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm">{title}</p>
  </div>
);

const FloodCard = ({ title, value, detail, status, statusBg, statusText, valueColor }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center">
    <h3 className="font-bold text-gray-800 mb-3">{title}</h3>
    <p className={`text-4xl font-bold ${valueColor} mb-2`}>{value}</p>
    <p className="text-sm text-gray-600">{detail}</p>
    <div className={`mt-4 ${statusBg} ${statusText} px-3 py-2 rounded text-sm font-medium`}>
      {status}
    </div>
  </div>
);

const SafetyStatusItem = ({ icon, title, status, statusColor }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-gray-700">{title}</span>
    </div>
    <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
  </div>
);

export default SmartRiverfrontDashboard;
