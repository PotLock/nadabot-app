import { useContext } from "react";

import { DialogsContext } from "@nadabot/contexts/DialogsProvider";

const useDialogs = () => useContext(DialogsContext);
export default useDialogs;
