export default interface QuestionnairesResponsesDashboard {
  last_day_questionnaires_responses_count: {
    count: number;
    growthRate: number;
  };
  questionnaires_responses_on_going_count: {
    count: number;
  };
  questionnaires_responses_per_month_chart: {
    data: {
      month: string;
      value: number;
    }[];
  };
  questionnaires_responses_per_social_action_chart: {
    data: {
      social_action: string;
      value: number;
    }[];
  };
  last_questionnaires_responses_table: {
    data: {
      avatar: string;
      operator: string;
      user: string;
    }[];
  };
}
