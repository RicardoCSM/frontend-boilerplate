"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn, isAxiosError } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Ads from "../../Interfaces/Ads";
import adsService from "../../Services/ads.service";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface DeleteAdsDialogProps {
  ads: Ads;
  refreshAds: () => Promise<void>;
}

const DeleteAdsDialog: React.FC<DeleteAdsDialogProps> = ({
  ads,
  refreshAds,
}) => {
  const deleteAds = async () => {
    try {
      const response = await adsService.delete(ads.id);
      if (response.status === 204) {
        await refreshAds();
        toast({
          title: "Banner deletado com sucesso.",
          description: "O banner de login foi deletado com sucesso.",
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
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="size-4 mr-2" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar o banner?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={deleteAds}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdsDialog;
