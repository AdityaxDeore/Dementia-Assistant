import React from 'react';
import { BackButton } from '@/components/ui/back-button';
import { PetCareDashboard } from '@/components/petcare-game';

export default function PetCareGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <BackButton to="/games" />
        <PetCareDashboard />
      </div>
    </div>
  );
}