import { Suspense } from 'react';
import DynamicContent from './content';

export default function TestDynamicPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>Loading...</div>}>
      <DynamicContent />
    </Suspense>
  );
}
