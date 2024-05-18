import { useContext } from "react";

import { DialogsContext } from "@nadabot/pages/_components/layout/DialogsProvider";

const useDialogs = () => useContext(DialogsContext);
export default useDialogs;
