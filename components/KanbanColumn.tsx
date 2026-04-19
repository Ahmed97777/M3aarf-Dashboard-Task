import { useRef, useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import AddTaskButton from "./AddTaskButton";
import { useDroppable } from "@dnd-kit/core";
import { COLUMNS, Task, ColumnType } from "@/types/taskTypes";
import { Box, Typography, CircularProgress } from "@mui/material";

const PAGE_SIZE = 5;

interface KanbanColumnProps {
  column: (typeof COLUMNS)[number];
  tasks: Task[];
  onAddTask: (column: ColumnType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const visibleTasks = tasks.slice(0, visibleCount);
  const hasMore = visibleCount < tasks.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    let timerId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          setIsLoading(true);
          timerId = setTimeout(() => {
            setVisibleCount((prev) => prev + PAGE_SIZE);
            setIsLoading(false);
            isLoadingRef.current = false;
          }, 500);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timerId);
    };
  }, [hasMore, visibleTasks.length]);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: "80vh",
        flex: "1 1 0",
        minWidth: 240,
        maxWidth: 320,
        bgcolor: isOver ? "#dde6e6" : "#ebf0f0",
        borderRadius: 2.5,
        p: 2,
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.15s",
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

      {/* Scrollable task list */}
      <Box sx={{ overflow: "auto", flex: 1 }}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {/* Sentinel*/}
        {(hasMore || isLoading) && (
          <Box
            ref={sentinelRef}
            sx={{ display: "flex", justifyContent: "center", py: 1 }}
          >
            <CircularProgress
              size={16}
              thickness={5}
              sx={{ color: "#9ca3af" }}
            />
          </Box>
        )}

        {/* End of list indicator */}
        {!hasMore && tasks.length > PAGE_SIZE && (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.68rem",
              color: "#9ca3af",
              py: 1,
            }}
          >
            all {tasks.length} tasks loaded
          </Typography>
        )}
      </Box>

      <AddTaskButton onClick={() => onAddTask(column.id)} />
    </Box>
  );
}

export default KanbanColumn;
