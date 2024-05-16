import { useContext } from "react";

import SpinnerContext from "@nadabot/common/contexts/SpinnerProvider";

const useSpinner = () => useContext(SpinnerContext);
export default useSpinner;
