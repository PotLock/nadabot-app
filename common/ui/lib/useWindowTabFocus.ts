import { useEffect } from "react";

const useWindowTabFocus = (handler: () => void) => {
  // Call handler every time the window tab is focused
  useEffect(() => {
    window.addEventListener("focus", handler);

    return () => {
      window.removeEventListener("focus", handler);
    };
  }, [handler]);
};

export default useWindowTabFocus;
