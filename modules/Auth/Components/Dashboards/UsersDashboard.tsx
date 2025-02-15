import { DashboardElementInstance } from "@/modules/Common/Components/Constants/DashboardElements";
import DashboardElementsRender from "@/modules/Common/Components/Dashboards/DashboardElementsRender";
import { TabComponentProps } from "@/modules/Common/Interfaces/Dashboard";
import { useCallback, useEffect, useState } from "react";
import UsersDashboardSkeleton from "./_partials/UsersDashboardSkeleton";
import usersService from "../../Services/users.service";
import type UsersDashboard from "../../Interfaces/UsersDashboard";

const mountDashboardElements = (
  data: UsersDashboard,
): DashboardElementInstance[] => {
  const elements: DashboardElementInstance[] = [];

  elements.push({
    type: "NumberCard",
    extraAttributes: {
      title: "Usuários no sistema",
      icon: "UsersRound",
      value: data.users_count.count,
      description:
        data.users_count.growthRate > 0
          ? `Crescimento de ${data.users_count.growthRate.toFixed(1)}% em relação ao mês anterior`
          : `Decréscimo de ${Math.abs(data.users_count.growthRate).toFixed(1)}% em relação ao mês anterior`,
    },
    row: 1,
    col: 1,
  });

  elements.push({
    type: "NumberCard",
    extraAttributes: {
      title: "Logins nas últimas 24 horas",
      icon: "UserRoundCheck",
      value: data.last_day_logins_count.count,
      description:
        data.last_day_logins_count.growthRate > 0
          ? `Crescimento de ${data.last_day_logins_count.growthRate.toFixed(1)}% em relação ao dia anterior`
          : `Decréscimo de ${Math.abs(data.last_day_logins_count.growthRate).toFixed(1)}% em relação ao dia anterior`,
    },
    row: 1,
    col: 2,
  });

  elements.push({
    type: "NumberCard",
    extraAttributes: {
      title: "Usuários criados no último mês",
      icon: "UserPlus",
      value: data.users_created_last_month.count,
      description:
        data.users_created_last_month.growthRate > 0
          ? `Crescimento de ${data.users_created_last_month.growthRate.toFixed(1)}% em relação ao mês anterior`
          : `Decréscimo de ${Math.abs(data.users_created_last_month.growthRate).toFixed(1)}% em relação ao mês anterior`,
    },
    row: 1,
    col: 3,
  });

  elements.push({
    type: "BarChartCard",
    extraAttributes: {
      title: "Acessos por mês",
      timePeriod: "Últimos 6 meses",
      icon: null,
      config: {
        value: {
          label: "Valor",
          color: "hsl(var(--chart-2))",
        },
      },
      data: data.logins_per_month_chart.data,
      dataKey: "value",
      axisDataKey: "month",
    },
    row: 2,
    col: 1,
    row_span: 2,
  });

  elements.push({
    type: "TableCard",
    extraAttributes: {
      title: "Últimos Usuários a acessarem o sistema",
      description: "Lista dos últimos 5 Usuários a acessarem o sistema",
      icon: "UserCog",
      columns: [
        {
          label: "",
          value: "avatar",
          type: "avatar",
        },
        {
          label: "Usuário",
          value: "user",
          type: "text",
        },
        {
          label: "Login",
          value: "login",
          type: "text",
        },
      ],
      values: data.last_logins_table.data,
    },
    row: 2,
    col: 3,
    row_span: 2,
    col_span: 2,
  });

  return elements;
};

const UsersDashboard: React.FC<TabComponentProps> = ({
  loading,
  dateRange,
  filters,
}) => {
  const { isLoading, setIsLoading } = loading;
  const [elements, setElements] = useState<DashboardElementInstance[]>([]);

  const fetchElements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await usersService.dashboard(
        {
          start_date: dateRange?.start_date,
          end_date: dateRange?.end_date,
        },
        filters,
      );
      if (response.status === 200) {
        const data: UsersDashboard = response.data;
        const elements = mountDashboardElements(data);
        setElements(elements);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, filters, setIsLoading]);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return (
    <>
      {isLoading ? (
        <UsersDashboardSkeleton />
      ) : (
        <DashboardElementsRender elements={elements} />
      )}
    </>
  );
};

export default UsersDashboard;
