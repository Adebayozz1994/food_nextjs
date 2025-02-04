'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/Components/Usercontext/page';

const Dashboard = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/food/login');
      return;
    }
    setUser(JSON.parse(storedUser)); 
  }, [setUser, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {user.firstName} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Dashboard;
