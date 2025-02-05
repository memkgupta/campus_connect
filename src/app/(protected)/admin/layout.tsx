"use client"
import { Sidebar } from '@/components/admin/Sidebar';
import Loader from '@/components/loader';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {user,isAuthenticated} = useSession()
  const [loading,setLoading] = useState(true);
  const router = useRouter()
  useEffect(()=>{
    if(isAuthenticated && user?.role=="ADMIN"){
      setLoading(false);
    }
    else{
      isAuthenticated && router.replace("/not-found");
    }
  },[
    user,isAuthenticated
  ])
  return (
    <div className="flex h-screen w-full">
 {loading ? <Loader/> :<>
  <Sidebar />
      <main className="flex-1  bg-background p-8">
        {children}
      </main>
 </>}
    </div>
  );
}