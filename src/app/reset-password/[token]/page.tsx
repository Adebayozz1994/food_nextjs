// app/reset-password/[token]/page.tsx
import React from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function Page({
  params,
  
}: {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): React.ReactElement {
  return <ResetPasswordClient token={params.token} />;
}
