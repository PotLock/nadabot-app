import { CircularProgress, Stack } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { createContext, useCallback, useState } from "react";

type SpinnerContextProps = {
  showSpinner: () => void;
  hideSpinner: () => void;
};

const SpinnerContext = createContext<SpinnerContextProps>({
  showSpinner: () => {
    throw new Error("showSpinner must be defined");
  },
  hideSpinner: () => {
    throw new Error("showSpinner must be defined");
  },
});

export default SpinnerContext;

export const SpinnerProvider = ({ children }: { children: JSX.Element }) => {
  const [show, setShow] = useState(false);

  const showSpinner = useCallback(() => {
    setShow(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      {/* Spinner Container */}
      {show && (
        <Stack
          width="100%"
          height="100%"
          position="fixed"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.8)"
          zIndex={999}
        >
          <CircularProgress sx={{ color: colors.BLUE }} />
        </Stack>
      )}
      {children}
    </SpinnerContext.Provider>
  );
};
