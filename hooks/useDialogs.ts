import { DialogsContext } from "@nadabot/contexts/DialogsProvider";
import { useContext } from "react";

const useDialogs = () => useContext(DialogsContext);
export default useDialogs;
