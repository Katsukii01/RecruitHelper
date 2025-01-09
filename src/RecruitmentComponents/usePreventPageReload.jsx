import { useEffect } from "react";

const usePreventPageReload = (isFormDirty) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes. Do you really want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);
};

export default usePreventPageReload;
