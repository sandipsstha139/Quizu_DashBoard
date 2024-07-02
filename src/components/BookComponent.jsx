import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  author: Yup.string().required("Author is required"),
  publication: Yup.string().required("Publication is required"),
  edition: Yup.string().required("Edition is required"),
  coverImage: Yup.mixed().required("Image is required"),
});

const BookComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("success");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      author: "",
      publication: "",
      edition: "",
      coverImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("author", values.author);
        formData.append("publication", values.publication);
        formData.append("edition", values.edition);
        formData.append("coverImage", values.coverImage);

        let response;
        if (isUpdateMode) {
          response = await ApiRequest.patch(
            `/book/${selectedBook._id}`,
            formData
          );
          handleSnackbarOpen("Book updated successfully", "success");
        } else {
          response = await ApiRequest.post("/book", formData);
          handleSnackbarOpen("Book created successfully", "success");
        }
        resetForm();
        fetchBooks();
        setIsUpdateMode(false);
      } catch (error) {
        console.error(
          isUpdateMode ? "Error updating book:" : "Error creating book:",
          error
        );
        handleSnackbarOpen(
          `Failed to ${isUpdateMode ? "update" : "create"} book`,
          "error"
        );
      }
    },
  });

  const fetchBooks = async () => {
    try {
      const response = await ApiRequest.get("/book");
      setBooks(response?.data?.data?.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiRequest.delete(`/book/${id}`);
      setBooks(books.filter((item) => item._id !== id));
      fetchBooks();
      setOpenDialog(false);
      handleSnackbarOpen("Book deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting book:", error);
      handleSnackbarOpen("Failed to delete book", "error");
    }
  };

  const handleOpenDialog = (item) => {
    setSelectedBook(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBook(null);
    setOpenDialog(false);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    formik.setValues({
      title: book.title,
      description: book.description,
      author: book.author,
      publication: book.publication,
      edition: book.edition,
      coverImage: null, // Reset cover image when updating
    });
    setIsUpdateMode(true);
  };

  const handleSnackbarOpen = (message, variant) => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        key={snackbarMessage}
        severity={snackbarVariant}
      />
      <Typography variant="h4" gutterBottom>
        Book Management
      </Typography>
      <Stack direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  name="author"
                  label="Author"
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  error={formik.touched.author && Boolean(formik.errors.author)}
                  helperText={formik.touched.author && formik.errors.author}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  name="publication"
                  label="Publication"
                  value={formik.values.publication}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.publication &&
                    Boolean(formik.errors.publication)
                  }
                  helperText={
                    formik.touched.publication && formik.errors.publication
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  name="edition"
                  label="Edition"
                  value={formik.values.edition}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.edition && Boolean(formik.errors.edition)
                  }
                  helperText={formik.touched.edition && formik.errors.edition}
                  sx={{ mb: 2 }}
                />
                <input
                  accept="image/*"
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  onChange={(event) =>
                    formik.setFieldValue(
                      "coverImage",
                      event.currentTarget.files[0]
                    )
                  }
                  sx={{ display: "none" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2, mt: 2 }}
                >
                  {isUpdateMode ? "Update" : "Submit"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    formik.resetForm();
                    setIsUpdateMode(false);
                  }}
                  sx={{ mt: 2 }}
                >
                  Reset
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {books.map((item) => (
              <Grid item xs={12} sm={6} key={item._id}>
                <Paper elevation={3} sx={{ maxWidth: "100%" }}>
                  <Card>
                    <CardHeader title={item.title} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Author: {item.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Publication: {item.publication}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Edition: {item.edition}
                      </Typography>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        style={{ width: "100%", height: "auto", marginTop: 10 }}
                      />
                    </CardContent>
                    <CardActions>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditBook(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Book?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedBook._id)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookComponent;
