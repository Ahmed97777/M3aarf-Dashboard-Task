import { Task } from "@/types/taskTypes";
import { Paper, Typography } from "@mui/material";
import PriorityBadge from "./PriorityBadge";

function TaskCard({ task }: { task: Task }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e5e7eb",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
        transition: "box-shadow 0.2s",
        cursor: "pointer",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#111827",
          mb: 0.5,
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
