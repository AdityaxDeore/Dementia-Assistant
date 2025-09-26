import React from 'react';
import { BackButton } from '@/components/ui/back-button';

export default function InteractiveMenuDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/dashboard" />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Interactive Menu Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Navigate through the app using the floating interactive menu at the bottom of the screen. 
            The menu uses beautiful Flaticon icons and smooth animations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="fi fi-rr-home text-2xl text-blue-600" />
              <h3 className="text-xl font-semibold">Dashboard</h3>
            </div>
            <p className="text-gray-600">
              Access your main dashboard with wellness tracking, mood monitoring, and personalized insights.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="fi fi-rr-users-alt text-2xl text-purple-600" />
              <h3 className="text-xl font-semibold">Community</h3>
            </div>
            <p className="text-gray-600">
              Connect with peers, join support groups, and participate in community discussions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="fi fi-rr-apps text-2xl text-green-600" />
              <h3 className="text-xl font-semibold">Resources</h3>
            </div>
            <p className="text-gray-600">
              Explore mental health resources, educational materials, and professional content.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="fi fi-brands-illustrator text-2xl text-orange-600" />
              <h3 className="text-xl font-semibold">Creative</h3>
            </div>
            <p className="text-gray-600">
              Express yourself through creative activities, art therapy, and mindful exercises.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">How to Use</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Look for the floating menu</h4>
                <p className="text-gray-600">The interactive navigation menu appears at the bottom center of your screen.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Click any icon</h4>
                <p className="text-gray-600">Tap on any of the four main navigation icons to switch between sections.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Enjoy the animations</h4>
                <p className="text-gray-600">Watch the smooth transitions and active state indicators as you navigate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}