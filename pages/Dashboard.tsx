import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import ProductCatalog from './ProductCatalog';
import JastiperDashboard from './JastiperDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Redirect based on user role
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium"></div>
      </div>
    );
  }

  // Show appropriate dashboard based on role
  if (user.role === 'jastiper' || user.isJastiper) {
    return <JastiperDashboard />;
  }

  // Default to customer dashboard (product catalog)
  return <ProductCatalog />;
};

export default Dashboard;
