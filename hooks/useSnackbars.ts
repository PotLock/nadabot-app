import { useContext } from "react";

import { SnackbarContext } from "@nadabot/common/contexts/SnackbarProvider";

const useSnackbars = () => useContext(SnackbarContext);
export default useSnackbars;
