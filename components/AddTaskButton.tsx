import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function AddTaskButton() {
  return (
    <Box
      sx={{
        mt: 1,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        border: "1.5px dashed #d1d5db",
        borderRadius: 2,
        cursor: "pointer",
        color: "#5c6670",
        fontSize: "0.8rem",
        fontWeight: 600,
        "&:hover": {
          borderColor: "#9ca3af",
          color: "#6b7280",
          bgcolor: "#f9fafb",
        },
        transition: "all 0.15s",
      }}
    >
      <AddIcon sx={{ fontSize: 16 }} />
      Add task
    </Box>
  );
}

export default AddTaskButton;
