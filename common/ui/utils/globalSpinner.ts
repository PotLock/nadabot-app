import { createContext, useContext } from "react";

type GlobalSpinnerContextProps = {
  showSpinner: (bgOpacity?: number) => void;
  hideSpinner: () => void;
};

export const GlobalSpinnerContext = createContext<GlobalSpinnerContextProps>({
  showSpinner: () => {
    throw new Error("showSpinner must be defined");
  },
  hideSpinner: () => {
    throw new Error("showSpinner must be defined");
  },
});

const useSpinner = () => useContext(GlobalSpinnerContext);
export default useSpinner;
