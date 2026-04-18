"use client";

import { useState, useEffect } from "react";
import { getTasks, updateTask } from "@/lib/api/tasks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TaskModal from "./TaskModal";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Task, ColumnType, COLUMNS, ModalState } from "@/types/taskTypes";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
} from "@mui/material";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function KanbanBoard() {
  const [modalState, setModalState] = useState<ModalState>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(searchInput.trim().toLowerCase(), 300);

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newColumn = over.id as ColumnType;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.column === newColumn) return;

    queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
      old.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t)),
    );

    updateTask(taskId, { ...task, column: newColumn }).catch(() => {
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((t) => (t.id === taskId ? { ...t, column: task.column } : t)),
      );
    });
  }

  const filteredTasks = debouncedSearch
    ? tasks.filter(
        (t) =>
          t.title.trim().toLowerCase().includes(debouncedSearch) ||
          t.description.trim().toLowerCase().includes(debouncedSearch),
      )
    : tasks;

  const tasksByColumn = (col: ColumnType) =>
    filteredTasks.filter((t) => t.column === col);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        {/* Top bar */}
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
          <div className="flex gap-1 items-center">
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
                {debouncedSearch
                  ? `${filteredTasks.length} of ${tasks.length} tasks`
                  : `${tasks.length} tasks`}
              </Typography>
            </div>
          </div>

          <TextField
            placeholder="Search tasks..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              },
            }}
          />
        </Box>

        {/* Board */}
        <Box sx={{ p: 3 }}>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load tasks. Make sure json-server is running on port
              4000.
            </Alert>
          )}

          {!isLoading && !isError && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={tasksByColumn(col.id)}
                  onAddTask={(column) =>
                    setModalState({ mode: "create", column })
                  }
                  onEditTask={(task) => setModalState({ mode: "edit", task })}
                  onDeleteTask={(task) =>
                    setModalState({ mode: "delete", task })
                  }
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Floating card while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </Box>

      <TaskModal
        key={
          modalState
            ? `${modalState.mode}-${"task" in modalState ? modalState.task.id : modalState.column}`
            : "closed"
        }
        state={modalState}
        onClose={() => setModalState(null)}
      />
    </DndContext>
  );
}
