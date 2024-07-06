"use client";
import ScoreComponent from "@/components/ScoreComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <ScoreComponent />
    </Box>
  );
};

export default page;
