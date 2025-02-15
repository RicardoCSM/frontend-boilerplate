import { Media } from "@/modules/Common/Interfaces/Tenant";

export default interface Theme {
  id: string;
  title: string;
  primary_logo_url: string;
  contrast_primary_logo_url: string;
  reduced_logo_url: string;
  contrast_reduced_logo_url: string;
  favicon_url: string;
  default_course_image_url: string;
  institutional_website_url: string;
  primary_color_light: string;
  secondary_color_light: string;
  primary_color_dark: string;
  secondary_color_dark: string;
  app_store_url: string;
  google_play_url: string;
  active: boolean;
  media?: Media[];
  created_at: string;
  updated_at?: string;
}
