import { Task } from "@/types/taskTypes";
import PriorityBadge from "./PriorityBadge";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Paper, Typography } from "@mui/material";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e5e7eb",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          "& .task-actions": { opacity: 1 },
        },
        transition: "box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Action buttons to be visible on hover */}
      <Box
        className="task-actions"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          display: "flex",
          gap: 0.5,
          opacity: 0,
          transition: "opacity 0.15s",
        }}
      >
        <IconButton
          size="small"
          onClick={() => onEdit(task)}
          sx={{ p: 0.3, color: "#9ca3af", "&:hover": { color: "#3c64d7" } }}
        >
          <EditOutlinedIcon sx={{ fontSize: 15 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onDelete(task)}
          sx={{ p: 0.3, color: "#9ca3af", "&:hover": { color: "#c83c38" } }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#111827",
          mb: 0.5,
          pr: 4,
        }}
      >
        {task.title}
      </Typography>

      <Typography
        sx={{ fontSize: "0.78rem", color: "#616b75", lineHeight: 1.5 }}
      >
        {task.description}
      </Typography>

      <PriorityBadge priority={task.priority} />
    </Paper>
  );
}

export default TaskCard;
