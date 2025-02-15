"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import AdsListContainer from "@/modules/Tenant/Ads/Components/Containers/AdsListContainer";

export default function AdminAds() {
  return (
    <AdminLayout pageTitle="Banners de Login" requiredPermission="ads">
      <AdsListContainer />
    </AdminLayout>
  );
}
