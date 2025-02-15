"use client";

import Questionnaire from "../../Interfaces/Questionnaire";
import QuestionnaireResponseLayout from "../Layouts/QuestionnaireResponseLayout";
import QuestionnaireSubmitForm from "../Forms/QuestionnaireSubmitForm";

interface QuestionnaireResponseProps {
  questionnaire: Questionnaire;
}

const QuestionnaireResponse: React.FC<QuestionnaireResponseProps> = ({
  questionnaire,
}) => {
  return (
    <QuestionnaireResponseLayout>
      <QuestionnaireSubmitForm questionnaire={questionnaire} mode="create" />
    </QuestionnaireResponseLayout>
  );
};

export default QuestionnaireResponse;
