import { Stack } from "@mui/material";
import { useCallback, useState } from "react";

import { Spinner } from "./Spinner";
import { GlobalSpinnerContext } from "../utils/globalSpinner";

export const GlobalSpinnerOverlay = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.8);

  const showSpinner = useCallback((bgOpacity?: number) => {
    setOpacity(bgOpacity ? bgOpacity : 0.8);
    setVisible(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <GlobalSpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      {visible && (
        <Stack
          width="100%"
          height="100%"
          position="fixed"
          justifyContent="center"
          alignItems="center"
          bgcolor={`rgba(255, 255, 255, ${opacity})`}
          zIndex={1010}
        >
          <Spinner />
        </Stack>
      )}

      {children}
    </GlobalSpinnerContext.Provider>
  );
};
