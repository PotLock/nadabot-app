import { useContext } from "react";

import { SnackbarContext } from "@nadabot/contexts/SnackbarProvider";

const useSnackbars = () => useContext(SnackbarContext);
export default useSnackbars;
