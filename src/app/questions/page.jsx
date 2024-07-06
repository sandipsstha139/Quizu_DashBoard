"use client";

import QuestionsComponent from "@/components/QuestionsComponent";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <QuestionsComponent />
    </Box>
  );
};

export default page;
