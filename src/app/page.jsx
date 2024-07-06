"use client";
import React from "react";
import Dashboard from "@/sections/dashboard/Dashboard";
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/navigation";
import UserView from "@/views/user/UserView";
import { Box } from "@mui/material";

const page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
  }

  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <UserView />
    </Box>
  );
};

export default page;
