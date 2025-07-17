"use client";

import { useAuth } from "../context/AuthContext";

function page() {

  const { user, isAuthenticated, loading, logout } = useAuth();


  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default page
