// app/not-found.tsx - ✅ Fixed version
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Isolate the part that uses useSearchParams
function NotFoundContent() {
  const searchParams = useSearchParams();
  
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      {/* Your 404 page content */}
    </div>
  );
}

// The main page component wraps the client component in Suspense
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}