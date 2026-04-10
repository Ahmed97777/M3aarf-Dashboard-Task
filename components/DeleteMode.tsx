import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Task } from "@/types/taskTypes";
import { UseMutationResult } from "@tanstack/react-query";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function DeleteMode({
  state,
  isLoading,
  deleteMutation,
  onClose,
}: {
  state: {
    mode: "delete";
    task: Task;
  };
  isLoading: boolean;
  deleteMutation: UseMutationResult<boolean, Error, string, unknown>;
  onClose: () => void;
}) {
  function handleDelete() {
    if (state?.mode === "delete") deleteMutation.mutate(state.task.id);
  }

  return (
    <Dialog
      open
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1, minWidth: 360 },
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
      >
        <WarningAmberIcon sx={{ color: "#c83c38" }} />

        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
          Delete task?
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontSize: "0.85rem", color: "#616b75" }}>
          <strong style={{ color: "#111827" }}>{state.task.title}</strong> will
          be permanently removed. This cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            borderColor: "#d1d5db",
            color: "#374151",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          size="small"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            bgcolor: "#c83c38",
            "&:hover": { bgcolor: "#a82e2b" },
          }}
        >
          {isLoading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteMode;
