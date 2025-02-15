"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useTenant from "@/modules/Common/Hooks/useTenant";
import { Landmark } from "lucide-react";
import Link from "next/link";

const ThemeUrls = () => {
  const {
    tenant: { theme },
  } = useTenant();

  return (
    <div className="m-1 absolute left-4 bottom-4 space-x-2">
      {theme?.institutional_website_url && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link href={theme.institutional_website_url} target="_blank">
                <Landmark className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Site institucional</TooltipContent>
        </Tooltip>
      )}
      {theme?.google_play_url && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link href={theme.google_play_url} target="_blank">
                <svg
                  className="h-[1.2rem] w-[1.2rem]"
                  aria-hidden="true"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0,0h40v40H0V0z"></path>
                  <g>
                    <path
                      d="M19.7,19.2L4.3,35.3c0,0,0,0,0,0c0.5,1.7,2.1,3,4,3c0.8,0,1.5-0.2,2.1-0.6l0,0l17.4-9.9L19.7,19.2z"
                      fill="#EA4335"
                    ></path>
                    <path
                      d="M35.3,16.4L35.3,16.4l-7.5-4.3l-8.4,7.4l8.5,8.3l7.5-4.2c1.3-0.7,2.2-2.1,2.2-3.6C37.5,18.5,36.6,17.1,35.3,16.4z"
                      fill="#FBBC04"
                    ></path>
                    <path
                      d="M4.3,4.7C4.2,5,4.2,5.4,4.2,5.8v28.5c0,0.4,0,0.7,0.1,1.1l16-15.7L4.3,4.7z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M19.8,20l8-7.9L10.5,2.3C9.9,1.9,9.1,1.7,8.3,1.7c-1.9,0-3.6,1.3-4,3c0,0,0,0,0,0L19.8,20z"
                      fill="#34A853"
                    ></path>
                  </g>
                </svg>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aplicativo Play Store</TooltipContent>
        </Tooltip>
      )}
      {theme?.app_store_url && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link href={theme.app_store_url} target="_blank">
                <svg
                  className="h-[1.2rem] w-[1.2rem]"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="url(#paint0_linear_87_8317)"
                  />
                  <path
                    d="M18.4468 8.65403C18.7494 8.12586 18.5685 7.45126 18.0428 7.14727C17.5171 6.84328 16.8456 7.02502 16.543 7.55318L16.0153 8.47442L15.4875 7.55318C15.1849 7.02502 14.5134 6.84328 13.9877 7.14727C13.462 7.45126 13.2811 8.12586 13.5837 8.65403L14.748 10.6864L11.0652 17.1149H8.09831C7.49173 17.1149 7 17.6089 7 18.2183C7 18.8277 7.49173 19.3217 8.09831 19.3217H18.4324C18.523 19.0825 18.6184 18.6721 18.5169 18.2949C18.3644 17.7279 17.8 17.1149 16.8542 17.1149H13.5997L18.4468 8.65403Z"
                    fill="white"
                  />
                  <path
                    d="M11.6364 20.5419C11.449 20.3328 11.0292 19.9987 10.661 19.8888C10.0997 19.7211 9.67413 19.8263 9.45942 19.9179L8.64132 21.346C8.33874 21.8741 8.51963 22.5487 9.04535 22.8527C9.57107 23.1567 10.2425 22.975 10.5451 22.4468L11.6364 20.5419Z"
                    fill="white"
                  />
                  <path
                    d="M22.2295 19.3217H23.9017C24.5083 19.3217 25 18.8277 25 18.2183C25 17.6089 24.5083 17.1149 23.9017 17.1149H20.9653L17.6575 11.3411C17.4118 11.5757 16.9407 12.175 16.8695 12.8545C16.778 13.728 16.9152 14.4636 17.3271 15.1839C18.7118 17.6056 20.0987 20.0262 21.4854 22.4468C21.788 22.975 22.4594 23.1567 22.9852 22.8527C23.5109 22.5487 23.6918 21.8741 23.3892 21.346L22.2295 19.3217Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_87_8317"
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="30"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#2AC9FA" />
                      <stop offset="1" stop-color="#1F65EB" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aplicativo App Store</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default ThemeUrls;
