import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Routes } from "@nadabot/routes";

const useIsAdminPage = () => {
  const router = useRouter();
  const [isAdminPage, setIsAdminPage] = useState(
    router.route === Routes.ADMIN_HOME,
  );

  useEffect(() => {
    setIsAdminPage(router.route === Routes.ADMIN_HOME);
  }, [router]);

  return isAdminPage;
};

export default useIsAdminPage;
