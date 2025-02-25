// app/reset-password/[token]/page.tsx
import { Metadata } from 'next';
import ResetPasswordClient from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};

export default function ResetPassword({
  params,
}: {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ResetPasswordClient token={params.token} />;
}
