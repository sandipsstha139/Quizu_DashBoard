"use client";
import BookComponent from "@/components/BookComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <BookComponent />
    </Box>
  );
};

export default page;
