import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSpinner from "./useSpinner";
import { Routes } from "@nadabot/routes";

type Props = {
  redirectTo?: string;
};

/**
 * Check if there was an transaction, if so, take user to HOME
 */
const useTransactionDetection = (props?: Props) => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const [transactionDetected, setTransactionDetected] = useState(false);

  useEffect(() => {
    if (router.query.transactionHashes) {
      setTransactionDetected(true);

      if (props?.redirectTo) {
        showSpinner();
        setTimeout(() => {
          hideSpinner();
          router.replace(props.redirectTo as string);
        }, 500);
      }
    }
  }, [router, showSpinner, hideSpinner, props]);

  return transactionDetected;
};

export default useTransactionDetection;
