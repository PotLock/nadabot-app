import { useContext } from "react";

import { DialogsContext } from "@nadabot/components/dialogs/DialogsProvider";

const useDialogs = () => useContext(DialogsContext);
export default useDialogs;
