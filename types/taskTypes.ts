export type ColumnType = "backlog" | "in_progress" | "review" | "done";
export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  priority?: Priority;
}

export const COLUMNS: {
  id: ColumnType;
  label: string;
  dotColor: string;
}[] = [
  { id: "backlog", label: "TO DO", dotColor: "#3c64d7" },
  { id: "in_progress", label: "IN PROGRESS", dotColor: "#dc872d" },
  { id: "review", label: "IN REVIEW", dotColor: "#8c46be" },
  { id: "done", label: "DONE", dotColor: "#419673" },
];

export type ModalState =
  | { mode: "create"; column: ColumnType }
  | { mode: "edit"; task: Task }
  | { mode: "delete"; task: Task }
  | null;
