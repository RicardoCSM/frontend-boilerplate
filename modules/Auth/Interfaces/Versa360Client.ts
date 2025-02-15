import { icons } from "lucide-react";

export interface Versa360Scope {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Versa360Client {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  workspace: {
    id: string;
    name: string;
    project_id: string;
    created_at: string;
    updated_at: string;
    logo_path: string | null;
    dark_theme_logo_path: string | null;
    scopes: Versa360Scope[];
    icon: keyof typeof icons | null;
    layout_type: string;
  } | null;
}
