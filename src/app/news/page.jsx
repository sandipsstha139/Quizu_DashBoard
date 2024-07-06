"use client";
import NewsComponent from "@/components/NewsComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <NewsComponent />
    </Box>
  );
};

export default page;
