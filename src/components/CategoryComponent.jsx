import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";

import ApiRequest from "@/utils/apiRequest";

const CategoryComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await ApiRequest.get("/category");
      setCategories(response?.data?.data?.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCategory(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/category/${selectedCategory._id}`);
      setCategories(
        categories.filter((category) => category._id !== selectedCategory._id)
      );
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete category", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#008268" pb={2} gutterBottom>
          Category
        </Typography>
        <Typography color="primary">
          Total Categories: {categories.length}
        </Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCategory && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {selectedCategory.name}
              </span>
              "?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CategoryComponent;
