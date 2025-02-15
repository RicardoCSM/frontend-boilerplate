import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Ads from "@/modules/Tenant/Ads/Interfaces/Ads";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdsCarouselProps {
  ads: Ads[];
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({ ads }) => {
  return (
    <>
      {ads.length > 0 && (
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnFocusIn: true,
            }),
          ]}
        >
          <CarouselContent>
            {ads.map((ad, index) => (
              <CarouselItem key={index}>
                <div className="h-screen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.background_image_url}
                    alt={ad.title}
                    className="h-full w-full"
                  />
                  {(ad.button_text || ad.button_url) && (
                    <div className="absolute bottom-4 flex w-full justify-center">
                      <Button asChild>
                        <Link href={ad.button_url || ""} target="_blank">
                          {ad.button_text || "Saiba mais"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
};

export default AdsCarousel;
