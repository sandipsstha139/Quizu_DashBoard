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

const QuizComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [quizzes, setQuizzes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const response = await ApiRequest.get("/quiz");
      setQuizzes(response?.data?.data?.quizs || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedQuiz(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/quiz/${selectedQuiz._id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== selectedQuiz._id));
      enqueueSnackbar("Quiz deleted successfully", { variant: "success" });
      handleCloseDialog();
      fetchQuizzes();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete quiz", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#008268" pb={2} gutterBottom>
          Quizs
        </Typography>
        <Typography color="primary">Total Quizs: {quizzes.length}</Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="quiz table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>{quiz.category}</TableCell>
                <TableCell>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(quiz)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedQuiz && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Quiz"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete
              <span
                style={{ fontWeight: "bold" }}
              >{` ${selectedQuiz.title}`}</span>
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

export default QuizComponent;
