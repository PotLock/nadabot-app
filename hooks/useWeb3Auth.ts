import { Web3AuthContext } from "@nadabot/contexts/Web3AuthProvider";
import { useContext } from "react";

/**
 * A state that is updated everytime user enters the page. To get persisted state of user, use `useUser` hook.
 * @returns
 */
const useWeb3Auth = () => useContext(Web3AuthContext);
export default useWeb3Auth;
