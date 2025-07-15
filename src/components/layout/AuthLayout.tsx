import React from 'react';
import Footer from './Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">URL Insight</h1>
            <p className="text-gray-600 mt-2">Website Analysis Platform</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
