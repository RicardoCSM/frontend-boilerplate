"use client";

import LoginForm from "@/modules/Auth/Components/Forms/LoginForm";
import { LoginLayout } from "@/modules/Auth/Components/Layouts/LoginLayout";

export default function Login() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
