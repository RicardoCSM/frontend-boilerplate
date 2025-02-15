"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./_partials/DragOverlayWrapper";
import Ads from "../../Interfaces/Ads";
import { useForm } from "react-hook-form";
import { adsReorderSchema, AdsReorderSchema } from "../../Lib/Validations/ads";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import AdsReorderManager from "./_partials/AdsReorderManager";
import { useEffect } from "react";

interface AdsReorderDialogProps {
  ads: Ads[];
  refreshAds: () => Promise<void>;
}

const AdsReorderDialog: React.FC<AdsReorderDialogProps> = ({
  ads,
  refreshAds,
}) => {
  const form = useForm<AdsReorderSchema>({
    resolver: zodResolver(adsReorderSchema),
    defaultValues: {
      ids: ads.map((ad) => ad.id) || [],
    },
  });

  useEffect(() => {
    console.log(ads);
    form.reset({
      ids: ads.map((ad) => ad.id) || [],
    });
  }, [ads, form]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tenantSecondary">
          <Settings className="size-4 mr-2" />
          Reordenar
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <DialogTitle className="text-lg font-bold text-muted-foreground">
            Reordenar Banners de Login
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Arraste e solte para reordenar os banners de login.
          </DialogDescription>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto">
          <DndContext sensors={sensors}>
            <Form {...form}>
              <AdsReorderManager ads={ads} refreshAds={refreshAds} />
            </Form>
            <DragOverlayWrapper />
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdsReorderDialog;
