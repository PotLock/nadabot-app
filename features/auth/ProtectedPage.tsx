import { useRouter } from "next/router";
import { useEffect } from "react";

import { Routes } from "@nadabot/common/constants";
import { useUser } from "@nadabot/common/store/useUser";

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export default function ProtectedPage({ children }: Props) {
  const { walletConnected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!walletConnected) {
      router.replace(Routes.HOME);
    }
  }, [walletConnected, router]);

  if (!walletConnected) {
    return;
  }

  return <>{children}</>;
}
