"use client";

import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import Image from "next/image";
import { useState } from "react";

const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) {
    return null;
  }

  return (
    <DragOverlay>
      <div className="flex bg-accent border rounded-md w-max py-4 pl-6 pr-4 opacity-80 cursor-pointer pointer-events-none">
        <div className="flex items-center text-lg font-bold text-tenant-primary">
          <div>
            {draggedItem.data?.current?.background_image_url && (
              <Image
                src={draggedItem.data?.current?.background_image_url}
                alt="Ad"
                width={80}
                height={80}
                className="rounded-md mr-2"
              />
            )}
          </div>
          {draggedItem.data?.current?.button_text}
        </div>
      </div>
    </DragOverlay>
  );
};

export default DragOverlayWrapper;
