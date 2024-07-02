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
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  coverImage: Yup.mixed().required("Image is required"),
});

const NewsComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [news, setNews] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("success");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      coverImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("coverImage", values.coverImage);

        let response;
        if (isUpdateMode) {
          response = await ApiRequest.patch(
            `/news/${selectedNews._id}`,
            formData
          );
          handleSnackbarOpen("News updated successfully", "success");
        } else {
          response = await ApiRequest.post("/news", formData);
          handleSnackbarOpen("News created successfully", "success");
        }
        resetForm();
        fetchNews();
        setIsUpdateMode(false);
      } catch (error) {
        console.error(
          isUpdateMode ? "Error updating news:" : "Error creating news:",
          error
        );
        handleSnackbarOpen(
          `Failed to ${isUpdateMode ? "update" : "create"} news`,
          "error"
        );
      }
    },
  });

  const fetchNews = async () => {
    try {
      const response = await ApiRequest.get("/news");
      setNews(response?.data?.data?.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiRequest.delete(`/news/${id}`);
      setNews(news.filter((item) => item._id !== id));
      fetchNews();
      setOpenDialog(false);
      handleSnackbarOpen("News deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting news:", error);
      handleSnackbarOpen("Failed to delete news", "error");
    }
  };

  const handleOpenDialog = (item) => {
    setSelectedNews(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedNews(null);
    setOpenDialog(false);
  };

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    formik.setValues({
      title: newsItem.title,
      description: newsItem.description,
      coverImage: null,
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
    fetchNews();
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
        News Management
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
            {news.map((item) => (
              <Grid item xs={12} sm={6} key={item._id}>
                <Paper elevation={3} sx={{ maxWidth: "100%" }}>
                  <Card>
                    <CardHeader title={item.title} />
                    <CardContent>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </CardContent>
                    <CardActions>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditNews(item)}
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
        <DialogTitle id="alert-dialog-title">Delete News?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this news item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedNews._id)}
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

export default NewsComponent;
