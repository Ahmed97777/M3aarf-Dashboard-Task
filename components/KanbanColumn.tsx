import { COLUMNS, Task } from "@/types/taskTypes";
import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import AddTaskButton from "./AddTaskButton";

function KanbanColumn({
  column,
  tasks,
}: {
  column: (typeof COLUMNS)[number];
  tasks: Task[];
}) {
  return (
    <Box
      sx={{
        height: "100vh",
        flex: "1 1 0",
        minWidth: 240,
        maxWidth: 320,
        bgcolor: "#ebf0f0",
        borderRadius: 2.5,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: column.dotColor,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#374151",
            textTransform: "uppercase",
          }}
        >
          {column.label}
        </Typography>

        <Box
          sx={{
            ml: 0.5,
            px: 0.8,
            py: 0.1,
            bgcolor: "#e5e7eb",
            borderRadius: 1,
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#6b7280",
          }}
        >
          {tasks.length}
        </Box>
      </Box>

      <Box sx={{}}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      <AddTaskButton />
    </Box>
  );
}

export default KanbanColumn;
