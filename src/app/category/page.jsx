"use client";
import CategoryComponent from "@/components/CategoryComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <CategoryComponent />
    </Box>
  );
};

export default page;
