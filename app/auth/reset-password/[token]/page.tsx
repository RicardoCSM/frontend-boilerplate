"use client";

import ResetPasswordForm from "@/modules/Auth/Components/Forms/ResetPasswordForm";
import PasswordRecoveryLayout from "@/modules/Auth/Components/Layouts/PasswordRecoveryLayout";
import { Suspense } from "react";

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  return (
    <PasswordRecoveryLayout
      title="Redefinir senha"
      description="Informe uma nova senha para sua conta"
      next_label="Voltar para login"
      next_url="/login"
    >
      <Suspense>
        <ResetPasswordForm token={params.token} />
      </Suspense>
    </PasswordRecoveryLayout>
  );
}
