'use client';

import { Suspense } from 'react';

interface SearchParamsWrapperProps {
  children: React.ReactNode;
}

function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      Loading...
    </div>
  );
}

export default function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}