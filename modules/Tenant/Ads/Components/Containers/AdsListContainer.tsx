"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Ads from "../../Interfaces/Ads";
import adsService from "../../Services/ads.service";
import AdsList from "../Lists/AdsList";

const AdsListContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ads, setAds] = useState<Ads[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await adsService.index({
        per_page: "all",
      });

      if (response.status === 200) {
        setAds(response.data);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <AdsList ads={ads} refreshAds={fetchAds} />
      )}
    </>
  );
};

export default AdsListContainer;
