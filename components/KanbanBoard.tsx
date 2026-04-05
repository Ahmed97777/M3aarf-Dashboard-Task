"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/api/tasks";
import { Task, ColumnType, COLUMNS } from "@/types/taskTypes";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard() {
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasksByColumn = (col: ColumnType) =>
    tasks.filter((t) => t.column === col);

  const totalCount = tasks.length;

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", fontFamily: "sans-serif" }}
    >
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex gap-1 items-center justify-center">
          <DashboardIcon
            className="text-white bg-[#3c64d7] border border-blue-600 rounded-md p-1"
            sx={{ fontSize: 28 }}
          />

          <div className="flex flex-col justify-center p-2">
            <Typography
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: "#111827",
                textTransform: "uppercase",
              }}
            >
              Kanban Board
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#353638" }}>
              {totalCount} tasks
            </Typography>
          </div>
        </div>

        <TextField
          className="text-[#616b74] bg-[#e6e6eb] border rounded-md p-1"
          placeholder="Search tasks..."
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "#90959e" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 220,
            "& .MuiOutlinedInput-root": {
              fontSize: "0.8rem",
              bgcolor: "#e6e6eb",
              borderRadius: 2,
              "& fieldset": { borderColor: "#e5e7eb" },
              "& .MuiInputBase-input::placeholder": {
                color: "#5f6872",
                fontWeight: 600,
                opacity: 0.7,
              },
            },
          }}
        />
      </Box>

      <Box sx={{ p: 3 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load tasks. Make sure json-server is running on port 4000.
          </Alert>
        )}
        {!isLoading && !isError && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasksByColumn(col.id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
