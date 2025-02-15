import { AdvancedFilter } from "@/modules/Common/Interfaces/Filter";
import User from "../../Interfaces/User";

const userFilters: AdvancedFilter<User>[] = [
  {
    id: "name",
    label: "Nome",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    type: "text",
  },
  {
    id: "login",
    label: "Login",
    type: "text",
  },
  {
    id: "active",
    label: "Status",
    type: "boolean",
  },
];

export default userFilters;
