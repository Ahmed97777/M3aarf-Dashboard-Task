import { Chip } from "@mui/material";
import { Priority } from "@/types/taskTypes";

const PRIORITY_STYLES: Record<
  Priority,
  { color: string; bg: string; border: string }
> = {
  HIGH: { color: "#c83c38", bg: "#f0d2d2", border: "transparent" },
  MEDIUM: { color: "#df9444", bg: "#f5e6d2", border: "transparent" },
  LOW: { color: "#68717b", bg: "#e6e6eb", border: "transparent" },
};

function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  const s = PRIORITY_STYLES[priority];

  return (
    <Chip
      label={priority}
      size="small"
      sx={{
        mt: 1,
        height: 22,
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        color: s.color,
        bgcolor: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "4px",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

export default PriorityBadge;
