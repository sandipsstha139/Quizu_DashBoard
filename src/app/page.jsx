"use client";
import React, { Suspense } from "react";
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

const UserView = dynamic(() => import("@/views/user/UserView"), {
  ssr: false,
  loading: () => <CircularProgress />,
});

const Page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null; // Ensure the component doesn't render before redirect
  }

  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <UserView />
    </Box>
  );
};

export default Page;
