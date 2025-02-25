// app/reset-password/[token]/page.tsx
import React from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default async function Page({
  params,
}: {
  params: { token: string };
}): Promise<React.ReactElement> {
  return <ResetPasswordClient token={params.token} />;
}
