import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  FormControl,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";

const CreateQuiz = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiRequest.get("/category");
      setCategories(response?.data?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    coverImage: Yup.mixed().required("Cover Image is required"),
    duration: Yup.number().notOneOf(
      [0, null],
      "Duration must not be 0 or null"
    ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      coverImage: null,
      duration: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("coverImage", values.coverImage);
        formData.append("category", selectedCategory);
        formData.append("duration", values.duration);

        const res = await ApiRequest.post("/quiz", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        enqueueSnackbar("Quiz added successfully", { variant: "success" });
        console.log("Form Values:", values);
        setSelectedCategory("");
        resetForm();
        setImagePreview(null);
      } catch (error) {
        console.error("Error submitting form:", error);
        enqueueSnackbar("Failed to add quiz", { variant: "error" });
      }
    },
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    formik.setFieldValue("coverImage", event.currentTarget.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(event.currentTarget.files[0]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="title"
          label="Title"
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-category-label">Select Category</InputLabel>
          <Select
            labelId="select-category-label"
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Select Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="description"
          label="Description"
          fullWidth
          multiline
          rows={1}
          sx={{ mb: 2 }}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <Stack sx={{ mb: 2 }}>
          <input
            accept="image/*"
            id="coverImage"
            name="coverImage"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="coverImage">
            <Button
              variant="outlined"
              component="span"
              sx={{
                mt: 2,
                mr: 2,
                textTransform: "none",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f8f8",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Upload Cover Image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Cover Preview"
                style={{ maxWidth: "120px", maxHeight: "120px" }}
              />
            </Box>
          )}
          {formik.errors.coverImage && (
            <div style={{ color: "red", marginTop: "8px" }}>
              {formik.errors.coverImage}
            </div>
          )}
        </Stack>
        <TextField
          name="duration"
          label="Duration (minutes)"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.duration}
          onChange={formik.handleChange}
          error={formik.touched.duration && Boolean(formik.errors.duration)}
          helperText={formik.touched.duration && formik.errors.duration}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateQuiz;
