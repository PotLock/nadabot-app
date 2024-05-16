import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "@nadabot/hooks/store/useUser";
import { Routes } from "@nadabot/routes";

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
