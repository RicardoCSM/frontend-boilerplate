"use client";

import ForgotPasswordForm from "@/modules/Auth/Components/Forms/ForgotPasswordForm";
import PasswordRecoveryLayout from "@/modules/Auth/Components/Layouts/PasswordRecoveryLayout";

export default function ForgotPassword() {
  return (
    <PasswordRecoveryLayout
      title="Recuperar Senha"
      description="Insira seu login abaixo para que possamos enviar um link de redefinição"
      back_url="/auth/login"
      next_label="Voltar para login"
      next_url="/login"
    >
      <ForgotPasswordForm />
    </PasswordRecoveryLayout>
  );
}
