import { useContext, useEffect } from "react";
import { GlobalContext } from "../components/Context/ShareContexts";
import Filler from "../components/Filler";

export default function Events() {
  // global context
  const { setChat, setShowChat, setShowMsg } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(false);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

  return <Filler />;
}
