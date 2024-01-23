import { useContext } from "react";

import SpinnerContext from "@nadabot/contexts/SpinnerProvider";

const useSpinner = () => useContext(SpinnerContext);
export default useSpinner;
