"use client";

import { cn } from "@/lib/utils";
import {
  DashboardElementInstance,
  DashboardElements,
} from "../Constants/DashboardElements";

interface DashboardElementsRenderProps {
  elements: DashboardElementInstance[];
}

const DashboardElementsRender: React.FC<DashboardElementsRenderProps> = ({
  elements,
}) => {
  const rows = elements.reduce((acc, curr) => {
    if (curr.row > acc) return curr.row;
    return acc;
  }, 0);

  const elementsByRow = Array.from({ length: rows }, (_, i) => {
    return elements
      .filter((element) => element.row === i + 1)
      .sort((a, b) => a.col - b.col);
  });

  return (
    <>
      {elementsByRow.map((elements, i) => {
        const gridRows = elements.reduce((acc, curr) => {
          if (curr.row_span && curr.row_span > acc) {
            return curr.row_span;
          }
          return acc;
        }, 1);

        return (
          <div
            key={i}
            className={cn(
              "flex flex-col lg:grid grid-flow-col gap-4 auto-cols-fr",
              `grid-rows-${gridRows}`,
            )}
          >
            {elements.map((element, index) => {
              const ElementComponent =
                DashboardElements[element.type].dashboardComponent;

              return (
                <div
                  key={index}
                  className={cn(
                    element.row_span && `row-span-${element.row_span}`,
                    element.col_span && `col-span-${element.col_span}`,
                  )}
                >
                  <ElementComponent elementInstance={element} />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default DashboardElementsRender;
