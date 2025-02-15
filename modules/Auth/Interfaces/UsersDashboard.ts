export default interface UsersDashboard {
  users_count: {
    count: number;
    growthRate: number;
  };
  last_day_logins_count: {
    count: number;
    growthRate: number;
  };
  users_created_last_month: {
    count: number;
    growthRate: number;
  };
  logins_per_month_chart: {
    data: {
      month: string;
      count: number;
    }[];
  };
  last_logins_table: {
    data: {
      avatar: string | null;
      user: string;
      login: string;
    }[];
  };
}
