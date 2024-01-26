import { Stack } from "@mui/material";
import Image from "next/image";
import { createContext, useCallback, useState } from "react";

import nadabotIcon from "@nadabot/assets/images/nadabot-icon.png";

type SpinnerContextProps = {
  showSpinner: (bgOpacity?: number) => void;
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
  const [opacity, setOpacity] = useState(0.8);

  const showSpinner = useCallback((bgOpacity?: number) => {
    setOpacity(bgOpacity ? bgOpacity : 0.8);
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
          bgcolor={`rgba(255, 255, 255, ${opacity})`}
          zIndex={1010}
        >
          <div className="nadabot-spinner">
            <Image
              src={nadabotIcon.src}
              priority={true}
              width={50}
              height={50}
              alt="Nada.Bot"
              style={{ marginRight: "8px" }}
            />
          </div>
        </Stack>
      )}
      {children}
    </SpinnerContext.Provider>
  );
};
