"use client";

import ErrorLayout from "@/modules/Common/Components/RootLayout/ErrorLayout/ErrorLayout";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";

export default function NotFound() {
  return (
    <ErrorLayout
      statusCode={404}
      title="Página não encontrada"
      description="a página que você está procurando não foi encontrada."
      icon={<NoResultsFounded />}
    />
  );
}
