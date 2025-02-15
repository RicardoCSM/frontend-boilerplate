import Ads from "@/modules/Tenant/Ads/Interfaces/Ads";
import Theme from "@/modules/Tenant/Themes/Interfaces/Theme";

export interface Media {
  id: string;
  collection: string;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
  conversions: string[];
  custom_properties: string[];
}

export interface Preference {
  key: string;
  value: string;
}

export interface TenantData {
  tenant: {
    modules: string[];
    name: string;
    theme: Theme;
    ads: Ads[];
    preference: Preference[];
  };
}
