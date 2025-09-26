import { AudioSessions } from "@/components/audio-sessions";
import { BackButton } from "@/components/ui/back-button";

export default function AudioSessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" data-testid="page-audio-sessions">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-slate-400/5 to-gray-400/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/3 to-slate-400/3 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-400/4 to-slate-400/4 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        
        {/* Small floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-slate-300 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-gray-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-20 w-1.5 h-1.5 bg-slate-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 right-40 w-1 h-1 bg-gray-400 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        
        {/* Medium floating elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-slate-200/10 to-gray-200/10 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-blue-200/8 to-slate-200/8 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="p-6">
          <BackButton to="/dashboard" className="text-gray-800 hover:text-blue-600" />
        </div>
        <AudioSessions />
      </div>
    </div>
  );
}