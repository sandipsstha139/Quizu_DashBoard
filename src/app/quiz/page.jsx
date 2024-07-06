"use client";
import QuizComponent from "@/components/QuizComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <QuizComponent />
    </Box>
  );
};

export default page;
