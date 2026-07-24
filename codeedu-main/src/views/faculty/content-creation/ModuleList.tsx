import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import CustomButton from "./CustomButton";
import { Module } from "./course";

interface ModuleListProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onAddModule: () => void;
  onReorderModules: (newModules: Module[]) => void;
  selectedModuleId?: string;
}

const SortableModuleItem: React.FC<{
  module: Module;
  selected: boolean;
  onClick: () => void;
}> = ({ module, selected, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-2 flex items-center cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex w-full">
        <div className="flex relative top-6">
          <div className="h-6 w-0.5 bg-gray-300 relative left-3 bottom-8"></div>
          <GripVertical
            className="h-6 w-6 shrink-0 text-gray-400"
            {...attributes}
            {...listeners}
          />
          <div className="h-0.5 w-4 bg-gray-300 relative left-0 top-2"></div>

        </div>
        <span className={`text-sm border relative top-2 ml-1 w-full p-3 rounded-md overflow-hidden  ${selected ? "bg-gray-200" : "bg-white"}`}>
          {module.title}
        </span>
      </div>
    </div>
  );
};

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  onSelectModule,
  onAddModule,
  onReorderModules,
  selectedModuleId,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      const newModules = arrayMove(modules, oldIndex, newIndex);
      onReorderModules(newModules);
    }
  };

  return (
    <div className="w-fit ml-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {modules.map((module) => (
            <SortableModuleItem
              key={module.id}
              module={module}
              selected={selectedModuleId === module.id}
              onClick={() => onSelectModule(module.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="p-4">
        <CustomButton
          onClick={onAddModule}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
         Add Module
        </CustomButton>
      </div>
    </div>
  );
};

export default ModuleList;
