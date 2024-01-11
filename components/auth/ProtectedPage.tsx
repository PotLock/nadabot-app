import { useEffect } from "react";
import { useUser } from "@nadabot/hooks/store/useUser";
import { useRouter } from "next/router";

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export default function ProtectedPage({ children }: Props) {
  const { walletConnected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!walletConnected) {
      router.replace("/");
    }
  }, [walletConnected, router]);

  if (!walletConnected) {
    return;
  }

  return <>{children}</>;
}
