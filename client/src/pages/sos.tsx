import React from 'react';
import AdvancedSOS from '@/components/advanced-sos';

export default function SOSPage() {
  const handleEmergencyTriggered = (event: any) => {
    console.log('Emergency triggered:', event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Emergency SOS System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced emergency response system with AI monitoring, Tele-MANAS integration, 
              and instant family notifications for comprehensive dementia care support.
            </p>
          </div>

          <AdvancedSOS 
            onEmergencyTriggered={handleEmergencyTriggered}
            aiMonitoringEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}