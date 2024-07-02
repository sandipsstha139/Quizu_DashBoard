import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  FormControl,
  FormLabel,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  questionTitle: Yup.string().required("Question Title is required"),
  options: Yup.array()
    .of(Yup.string().required("Option cannot be empty"))
    .min(4, "At least 4 options are required")
    .max(4, "No more than 4 options allowed"),
  correct_option: Yup.string().required("Correct Option is required"),
  quiz: Yup.string().required("Quiz is required"),
});

const CreateQuestions = () => {
  const [quizs, setQuizs] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchQuizs = async () => {
    try {
      const response = await ApiRequest.get("/quiz");
      setQuizs(response?.data?.data?.quizs || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuizs();
  }, []);

  const formik = useFormik({
    initialValues: {
      questionTitle: "",
      options: ["", "", "", ""],
      correct_option: "",
      quiz: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await ApiRequest.post("/question", values);
        enqueueSnackbar("Question added successfully", { variant: "success" });
        resetForm();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Failed to add question", { variant: "error" });
      }
    },
  });

  const handleOptionChange = (index, event) => {
    const newOptions = [...formik.values.options];
    newOptions[index] = event.target.value;
    formik.setFieldValue("options", newOptions);
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="questionTitle"
          label="Question Title"
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.questionTitle}
          onChange={formik.handleChange}
          error={
            formik.touched.questionTitle && Boolean(formik.errors.questionTitle)
          }
          helperText={
            formik.touched.questionTitle && formik.errors.questionTitle
          }
        />
        <Stack direction="row" spacing={2}>
          {[0, 1].map((index) => (
            <TextField
              key={index}
              name={`options[${index}]`}
              label={`Option ${index + 1}`}
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.options[index]}
              onChange={(event) => handleOptionChange(index, event)}
              error={
                formik.touched.options &&
                formik.touched.options[index] &&
                Boolean(formik.errors.options?.[index])
              }
              helperText={
                formik.touched.options &&
                formik.touched.options[index] &&
                formik.errors.options?.[index]
              }
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {[2, 3].map((index) => (
            <TextField
              key={index}
              name={`options[${index}]`}
              label={`Option ${index + 1}`}
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.options[index]}
              onChange={(event) => handleOptionChange(index, event)}
              error={
                formik.touched.options &&
                formik.touched.options[index] &&
                Boolean(formik.errors.options?.[index])
              }
              helperText={
                formik.touched.options &&
                formik.touched.options[index] &&
                formik.errors.options?.[index]
              }
            />
          ))}
        </Stack>
        <Stack spacing={2} my={2}>
          <TextField
            name="correct_option"
            label="Correct Option"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.correct_option}
            onChange={formik.handleChange}
            error={
              formik.touched.correct_option &&
              Boolean(formik.errors.correct_option)
            }
            helperText={
              formik.touched.correct_option && formik.errors.correct_option
            }
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="select-category-label">Select Category</InputLabel>
            <Select
              id="select-category-label"
              name="quiz"
              label="Select Quiz"
              placeholder="Select Quiz"
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.quiz}
              onChange={formik.handleChange}
              error={formik.touched.quiz && Boolean(formik.errors.quiz)}
              helperText={formik.touched.quiz && formik.errors.quiz}
            >
              {quizs.length > 0 ? (
                quizs.map((quiz) => (
                  <MenuItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No quizzes available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateQuestions;
