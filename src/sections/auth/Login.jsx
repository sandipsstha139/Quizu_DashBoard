"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import ApiRequest from "@/utils/apiRequest";
import { useAuth } from "@/context/userContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
});

const LoginPage = () => {
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await ApiRequest.post("/user/login", values);
        const { loggedInUser } = res?.data?.data;

        if (loggedInUser?.role === "admin") {
          setIsAuthenticated(true);
          localStorage.setItem(
            "token",
            JSON.stringify(res?.data?.data?.refreshToken)
          );
          setUser(loggedInUser);
          enqueueSnackbar("Login Successful", {
            variant: "success",
          });
          router.push("/");
        } else {
          enqueueSnackbar("Not Authorized", {
            variant: "error",
          });
        }
      } catch (error) {
        enqueueSnackbar("Failed to Login!", { variant: "error" });
        setIsAuthenticated(false);
        setErrorMessage(error.response?.data?.message);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: 6,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Login
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: "red" }}>
          ** Only Admins are allowed to access this page
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%", maxWidth: "400px" }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
              Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
