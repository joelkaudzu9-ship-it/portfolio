// app/unsubscribe/page.tsx
'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

// Create a separate component that uses useSearchParams
function UnsubscribeContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');

  useEffect(() => {
    if (email) {
      fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then(res => res.json())
        .then(data => {
          setStatus(data.success ? 'success' : 'error');
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="glass-card p-8 text-center max-w-md">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">Processing...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Successfully Unsubscribed</h2>
            <p className="text-text-secondary">
              You have been removed from the newsletter list.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Something Went Wrong</h2>
            <p className="text-text-secondary">
              Please try again or contact me directly.
            </p>
          </>
        )}
        <a href="/" className="inline-block mt-6 text-amber-500 hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Loading...</h2>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}