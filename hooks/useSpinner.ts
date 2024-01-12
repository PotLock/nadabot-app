import SpinnerContext from "@nadabot/contexts/SpinnerProvider";
import { useContext } from "react";

const useSpinner = () => useContext(SpinnerContext);
export default useSpinner;
