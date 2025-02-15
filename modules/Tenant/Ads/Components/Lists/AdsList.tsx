"use client";

import { Separator } from "@/components/ui/separator";
import Ads from "../../Interfaces/Ads";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import CreateAdsDialog from "../Dialogs/CreateAdsDialog";
import DeleteAdsDialog from "../Dialogs/DeleteAdsDialog";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import AdsActionsDialog from "../Dialogs/AdsActionsDialog";
import Link from "next/link";
import AdsReorderDialog from "../Dialogs/AdsReorderDialog";

interface AdsListProps {
  ads: Ads[];
  refreshAds: () => Promise<void>;
}

const AdsList: React.FC<AdsListProps> = ({ ads, refreshAds }) => {
  const { userData } = useAuth();

  return (
    <div className="flex flex-col flex-1 w-full ">
      <nav className="flex flex-col md:flex-row justify-between p-4 gap-3 items-center">
        <div className="flex flex-col gap-1 justify-start">
          <span className="flex items-center truncate font-medium gap-2">
            Configuração de Banners de Login
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AdsReorderDialog ads={ads} refreshAds={refreshAds} />
        </div>
      </nav>
      <Separator />
      <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent">
        <Carousel>
          <CarouselContent className="w-90vh md:w-[583px]">
            {ads.map((ad, index) => (
              <CarouselItem key={index}>
                <div className="h-[640px] w-90vh md:w-[583px]">
                  <div className="w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.background_image_url}
                      alt={ad.title}
                      className="h-full w-full"
                    />
                    {(ad.button_text || ad.button_url) && (
                      <div className="absolute bottom-24 flex w-full justify-center">
                        <Button asChild>
                          <Link href={ad.button_url || ""} target="_blank">
                            {ad.button_text || "Saiba mais"}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full justify-center gap-2 p-4">
                  {(userData?.permissions.includes("ALL-edit-ads") ||
                    userData?.permissions.includes("ALL-view-ads")) && (
                    <AdsActionsDialog
                      ads={ad}
                      refreshAds={refreshAds}
                      mode={
                        userData?.permissions.includes("ALL-edit-ads")
                          ? "edit"
                          : "view"
                      }
                    />
                  )}
                  <DeleteAdsDialog ads={ad} refreshAds={refreshAds} />
                </div>
              </CarouselItem>
            ))}
            {userData?.permissions.includes("ALL-create-ads") && (
              <CarouselItem>
                <CreateAdsDialog refreshAds={refreshAds} />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default AdsList;
