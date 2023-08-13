import TaskCard from "@/components/TaskCard";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Column, Id, Task } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[calc(100vh-16vh)] rounded-md flex flex-col"
    >
      <Card
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md cursor-grab border-2 rounded-md font-bold flex items-center justify-between"
      >
        <Input
          value={column.title}
          ref={inputRef}
          className="border-none outline-none w-full"
          onChange={(e) => {
            if (!editMode) return;
            updateColumn(column.id, e.target.value);
          }}
          autoFocus
          onBlur={() => {
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
              setEditMode(false);
            }
          }}
        />
        <TrashIcon
          className="w-5 h-5 mr-2 cursor-pointer hover:text-red-500"
          onClick={() => deleteColumn(column.id)}
        />
      </Card>
      <div className="flex flex-grow flex-col gap-4 mt-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <Button className="mt-6" onClick={() => createTask(column.id)}>
        <PlusIcon />
        Add task
      </Button>
    </div>
  );
}

export default ColumnContainer;
