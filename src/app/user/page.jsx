import UserView from "@/views/user/UserView";
import { Box } from "@mui/material";
import React from "react";

const UserComponent = () => {
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <UserView />
    </Box>
  );
};

export default UserComponent;
