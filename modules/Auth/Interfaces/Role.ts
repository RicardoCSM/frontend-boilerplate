export interface Permission {
  name: string;
  description: string;
}

export interface PermissionGroup {
  name: string;
  permissions: Permission[];
}

export interface PermissionModule {
  name: string;
  groups: PermissionGroup[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
