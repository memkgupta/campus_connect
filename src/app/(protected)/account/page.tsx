"use client"
import React from 'react'
import { useSession } from 'next-auth/react';

function page() {
  const {data:session,status} = useSession();
  if (status==="authenticated") {
    return <div>succwss</div>;
  }
  else{
    return (
      "hello"
    )
  }
}

export default page