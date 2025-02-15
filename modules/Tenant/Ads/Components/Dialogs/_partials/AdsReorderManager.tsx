"use client";

import { useFormContext } from "react-hook-form";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn, isAxiosError } from "@/lib/utils";
import Ads from "../../../Interfaces/Ads";
import { AdsReorderSchema } from "../../../Lib/Validations/ads";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Save } from "lucide-react";
import Image from "next/image";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";
import { toast } from "@/hooks/use-toast";
import adsService from "../../../Services/ads.service";

interface AdsReorderManagerProps {
  ads: Ads[];
  refreshAds: () => Promise<void>;
}

const AdsReorderManager: React.FC<AdsReorderManagerProps> = ({
  ads,
  refreshAds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormContext<AdsReorderSchema>();

  const droppable = useDroppable({
    id: "ads-reorder-drop-area",
    data: {
      isDesignerBuilderDropArea: true,
    },
  });

  async function onSubmit(values: AdsReorderSchema) {
    setIsLoading(true);
    try {
      const response = await adsService.reorder(values);
      if (response.status === 204) {
        await refreshAds();
        toast({
          title: "Banners reordenados com sucesso.",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      const ids = form.getValues("ids");
      if (!active || !over) {
        return;
      }

      const activeIndex = active.data?.current?.index;

      if (activeIndex === undefined) return;

      const activeField = ids[activeIndex];

      if (!activeField) return;

      const overIndex = over.data?.current?.index;

      if (overIndex === undefined) return;

      const isTopHalf = over.data?.current?.isTopHalfElement;
      const isBottomHalf = over.data?.current?.isBottomHalfElement;

      let newIndex = overIndex;

      if (isTopHalf) {
        newIndex = overIndex;
      } else if (isBottomHalf) {
        newIndex = overIndex + 1;
      }

      const newFields = [...ids];

      newFields.splice(activeIndex, 1);
      newFields.splice(newIndex, 0, activeField);

      form.setValue("ids", newFields);
    },
  });

  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        "max-w-[900px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-3xl p-4 md:p-8 overflow-y-auto",
        droppable.isOver && "bg-opacity-80",
      )}
    >
      <div className="flex-1">
        {form.watch("ids").map((field, index) => {
          const ad = ads.find((ad) => ad.id === field);

          if (!ad) return null;

          return (
            <AdField key={field} index={index} ad={ad} disabled={isLoading} />
          );
        })}
      </div>
      <div className="flex w-full justify-center">
        <Button
          variant="tenantPrimary"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Save className="size-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
};

interface AdFieldProps {
  index: number;
  ad: Ads;
  disabled: boolean;
}

const AdField: React.FC<AdFieldProps> = ({ index, ad, disabled }) => {
  const draggable = useDraggable({
    id: ad.id + "-drag-handler",
    data: {
      background_image_url: ad.background_image_url,
      button_text: ad.button_text,
      index,
    },
  });

  const topHalf = useDroppable({
    id: ad.id + "-top",
    data: {
      background_image_url: ad.background_image_url,
      button_text: ad.button_text,
      index,
      isTopHalfElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: ad.id + "-bottom",
    data: {
      background_image_url: ad.background_image_url,
      button_text: ad.button_text,
      index,
      isBottomHalfElement: true,
    },
  });

  if (draggable.isDragging) return null;

  return (
    <div className="relative w-full flex flex-col text-foreground rounded-md ring-1 ring-accent ring-inset">
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute bottom-0 w-full h-1/2 rounded-b-md"
      />
      {!topHalf.isOver && !bottomHalf.isOver && !disabled && (
        <div
          ref={draggable.setNodeRef}
          {...draggable.attributes}
          {...draggable.listeners}
          className="absolute left-0 top-0 w-[24px] h-full rounded-md bg-accent bg-[radial-gradient(#c2c7cc_1.5px,transparent_1.5px)] [background-size:12px_12px] rounded-r-none cursor-grab"
        />
      )}
      <div
        className={cn(
          !topHalf.isOver && !bottomHalf.isOver && !disabled ? "pl-6" : "pl-2",
          "flex flex-col",
        )}
      >
        {topHalf.isOver && (
          <div className="absolute top-0 w-full h-[7px] bg-primary rounded-md rounded-b-none" />
        )}
        {bottomHalf.isOver && (
          <div className="absolute bottom-0 w-full h-[7px] bg-primary rounded-md rounded-t-none" />
        )}
        <div
          className={cn(
            "z-20 py-4 pl-2 pr-4",
            (topHalf.isOver || bottomHalf.isOver) &&
              "pointer-events-none opacity-20",
          )}
        >
          <div className="flex items-center text-lg font-bold text-tenant-primary">
            <Image
              src={ad.background_image_url}
              alt="Ad"
              width={80}
              height={80}
              className="rounded-md mr-2"
            />
            {ad.button_text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsReorderManager;
