import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { ColumnType, ModalState, Priority, Task } from "@/types/taskTypes";

const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];
const COLUMNS: { id: ColumnType; label: string }[] = [
  { id: "backlog", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "In Review" },
  { id: "done", label: "Done" },
];

function CreateEditMode({
  state,
  isLoading,
  createMutation,
  updateMutation,
  onClose,
}: {
  state: ModalState;
  isLoading: boolean;
  createMutation: UseMutationResult<
    unknown,
    Error,
    {
      title: string;
      description: string;
      column: string;
      priority?: string;
    },
    unknown
  >;
  updateMutation: UseMutationResult<unknown, Error, Task, unknown>;
  onClose: () => void;
}) {
  const isEdit = state?.mode === "edit";
  const initialTitle = state?.mode === "edit" ? state.task.title : "";
  const initialDescription =
    state?.mode === "edit" ? state.task.description : "";
  const initialColumn =
    state?.mode === "create"
      ? state.column
      : state?.mode === "edit"
        ? state.task.column
        : "backlog";
  const initialPriority =
    state?.mode === "edit" ? (state.task.priority ?? "MEDIUM") : "MEDIUM";

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [column, setColumn] = useState<ColumnType>(initialColumn);
  const [priority, setPriority] = useState<Priority>(initialPriority);

  function handleSubmit() {
    if (!state) return;
    if (state.mode === "create") {
      createMutation.mutate({ title, description, column, priority });
    }
    if (state.mode === "edit") {
      updateMutation.mutate({
        ...state.task,
        title,
        description,
        column,
        priority,
      });
    }
  }

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      fontSize: "0.82rem",
      borderRadius: 2,
      "& fieldset": { borderColor: "#e5e7eb" },
    },
    "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  };

  return (
    <Dialog
      open
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1, minWidth: 420 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}
        >
          {isEdit ? "Edit task" : "New task"}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "8px !important",
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
          autoFocus
          sx={fieldSx}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          fullWidth
          multiline
          rows={3}
          sx={fieldSx}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="Column"
            value={column}
            onChange={(e) => setColumn(e.target.value as ColumnType)}
            size="small"
            fullWidth
            sx={fieldSx}
          >
            {COLUMNS.map((c) => (
              <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.82rem" }}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            size="small"
            fullWidth
            sx={fieldSx}
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: "0.82rem" }}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Box>
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
          onClick={handleSubmit}
          variant="contained"
          size="small"
          disabled={isLoading || !title.trim()}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            bgcolor: "#3c64d7",
            "&:hover": { bgcolor: "#2f52b8" },
          }}
        >
          {isLoading ? "Saving…" : isEdit ? "Save changes" : "Create task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateEditMode;
