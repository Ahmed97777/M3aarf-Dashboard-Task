"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { ModalState, Task } from "@/types/taskTypes";
import CreateEditMode from "./CreateEditMode";
import DeleteMode from "./DeleteMode";

interface TaskModalProps {
  state: ModalState;
  onClose: () => void;
}

export default function TaskModal({ state, onClose }: TaskModalProps) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Task) => updateTask(id, data),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (!state) return null;

  if (state.mode === "delete") {
    return (
      <DeleteMode
        state={state}
        isLoading={isLoading}
        deleteMutation={deleteMutation}
        onClose={onClose}
      />
    );
  } else {
    return (
      <CreateEditMode
        state={state}
        isLoading={isLoading}
        createMutation={createMutation}
        updateMutation={updateMutation}
        onClose={onClose}
      />
    );
  }
}
