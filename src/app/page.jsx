"use client";
import React from "react";
import Dashboard from "@/sections/dashboard/Dashboard";
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/navigation";

const page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
  }

  return <Dashboard />;
};

export default page;
