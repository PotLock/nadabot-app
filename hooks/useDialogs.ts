import { useContext } from "react";

import { DialogsContext } from "@nadabot/pages/_components/dialogs";

const useDialogs = () => useContext(DialogsContext);
export default useDialogs;
