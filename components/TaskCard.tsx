import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Id, Task } from "../types";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 cursor-grab relative"
      ></Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!editMode) setEditMode(true);
      }}
      className="p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset cursor-grab relative task"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <Textarea
        className="h-full w-full resize-none border-none rounded bg-transparent text-white focus:outline-none cursor-grab"
        value={task.content}
        autoFocus
        ref={textAreaRef}
        placeholder="Task content here"
        onBlur={toggleEditMode}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            toggleEditMode();
          }
        }}
        onChange={(e) => {
          if (!editMode) return;
          updateTask(task.id, e.target.value);
        }}
      />
      {mouseIsOver && (
        <TrashIcon
          className="w-5 h-5 cursor-pointer hover:text-red-500"
          onClick={() => deleteTask(task.id)}
        />
      )}
    </Card>
  );
}

export default TaskCard;
