import { Task } from "@/types/taskTypes";
import PriorityBadge from "./PriorityBadge";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDragOverlay?: boolean;
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragOverlay = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <Paper
      ref={setNodeRef}
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
        transition: "box-shadow 0.2s, opacity 0.15s",
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
        // Hide the original card while its overlay is floating
        opacity: isDragging && !isDragOverlay ? 0 : 1,
        // Give the overlay a lifted shadow
        ...(isDragOverlay && {
          boxShadow: "0 8px 24px rgba(0,0,0,0.13)",
          rotate: "1.5deg",
        }),
      }}
      // Only attach drag listeners to the card body, not the action buttons
      {...listeners}
      {...attributes}
    >
      {/* Action buttons — stop propagation so they don't trigger drag */}
      <Box
        className="task-actions"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          display: "flex",
          gap: 0.5,
          opacity: isDragOverlay ? 0 : 0,
          transition: "opacity 0.15s",
        }}
      >
        <IconButton
          size="small"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
          sx={{ p: 0.3, color: "#9ca3af", "&:hover": { color: "#3c64d7" } }}
        >
          <EditOutlinedIcon sx={{ fontSize: 15 }} />
        </IconButton>
        <IconButton
          size="small"
          onPointerDown={(e) => e.stopPropagation()}
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
