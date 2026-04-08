import { Suspense } from 'react';
import DynamicContent from './content';

export default function TestDynamicPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', color: '#8BA3B5' }}>Loading...</div>}>
      <DynamicContent />
    </Suspense>
  );
}
