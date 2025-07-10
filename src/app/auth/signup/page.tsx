import React, { Suspense } from 'react';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading signup form...</div>}>
      <SignupForm />
    </Suspense>
  );
}
