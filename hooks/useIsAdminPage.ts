import { useRouter } from "next/router";
import { useState } from "react";

import { Routes } from "@nadabot/routes";

const useIsAdminPage = () => {
  const router = useRouter();
  const [isAdminPage] = useState(router.route === Routes.ADMIN_HOME);

  return isAdminPage;
};

export default useIsAdminPage;
