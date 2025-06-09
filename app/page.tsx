'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generateRandomParam } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SearchParamsWrapper from '../components/SearchParamsWrapper';
import '../public/styles/home.css';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = Array.from(searchParams.values())[0];
  const pdfPath = '/87.pdf'; // Path to the PDF in the public directory

  // Handle redirect and data validation
  useEffect(() => {
    if (!data) {
      notFound();
    }

    // Redirect after 3 seconds to allow PDF viewing
    const timer = setTimeout(() => {
      const randomParam = generateRandomParam();
      router.push(`/load?${randomParam}=${data}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [data, router]);

  if (!data) {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'relative',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#f5f5f5'
    }}>
      {/* PDF Display using iframe */}
      <iframe
        src={pdfPath}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="PDF Document"
      />

      {/* Redirect Notice */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 1000,
        fontWeight: '500'
      }}>
        🔄 Redirecting in 3 seconds...
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <SearchParamsWrapper>
      <HomePageContent />
    </SearchParamsWrapper>
  );
}