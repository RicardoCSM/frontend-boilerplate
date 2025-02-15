"use client";

import ErrorLayout from "@/modules/Common/Components/RootLayout/ErrorLayout/ErrorLayout";
import InternalError from "@/modules/Common/Components/RootLayout/Icons/InternalError";

export default function NotFound() {
  return (
    <ErrorLayout
      statusCode={500}
      title="Algo deu errado"
      description="tente novamente mais tarde."
      icon={<InternalError />}
    />
  );
}
