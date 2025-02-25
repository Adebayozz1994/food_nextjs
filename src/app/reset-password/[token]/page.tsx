// app/reset-password/[token]/page.tsx
import ResetPasswordClient from './ResetPasswordClient';

interface PageProps {
  params: { token: string };
}

export default async function Page({ params }: PageProps) {
  // Pass the token as a prop to the client component
  return <ResetPasswordClient token={params.token} />;
}
