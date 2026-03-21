// src/components/bots/BotActions.tsx
import { Play, Pause, RotateCcw, Trash2, FileText } from "lucide-react";

interface Actions {
  canStart: boolean;
  canStop: boolean;
  canRestart: boolean;
  canDelete: boolean;
  canViewLogs: boolean;
}

interface Props {
  actions: Actions;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
  onLogs: () => void;
  onDelete: () => void;
}

export default function BotActions({
  actions,
  onStart,
  onStop,
  onRestart,
  onLogs,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.canStart && (
        <button onClick={onStart} className="btn-secondary">
          <Play size={14} /> Start
        </button>
      )}

      {actions.canStop && (
        <button onClick={onStop} className="btn-secondary">
          <Pause size={14} /> Stop
        </button>
      )}

      {actions.canRestart && (
        <button onClick={onRestart} className="btn-secondary">
          <RotateCcw size={14} /> Restart
        </button>
      )}

      {actions.canViewLogs && (
        <button onClick={onLogs} className="btn-secondary">
          <FileText size={14} /> Logs
        </button>
      )}

      {actions.canDelete && (
        <button onClick={onDelete} className="btn-danger">
          <Trash2 size={14} /> Delete
        </button>
      )}
    </div>
  );
}