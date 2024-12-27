import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useBlocker } from "react-router-dom";
import EventEmitter, {
  DISABLE_BLOCK_NAVIGATION,
} from "../../helpers/EventEmitter";

export function useBlockNavigation({ isBlock, ignorePath = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [disabledBlock, setDisabledBlock] = useState(false);

  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  useEffect(() => {
    EventEmitter.subscribe(DISABLE_BLOCK_NAVIGATION, setDisabledBlock);
    return () =>
      EventEmitter.unsubscribe(DISABLE_BLOCK_NAVIGATION, setDisabledBlock);
  }, []);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setLastLocation(null);
  }, []);

  const handleBlockedNavigation = useCallback(
    (nextLocation) => {
      if (ignorePath.includes(nextLocation.location.pathname)) {
        setLastLocation(nextLocation);
        setConfirmedNavigation(true);
        return false;
      }

      const getFullUrl = (location) => {
        return location.pathname + (location.search || "");
      };

      if (
        !confirmedNavigation &&
        getFullUrl(nextLocation.location) !== getFullUrl(location)
      ) {
        setShowPrompt(true);
        setLastLocation(nextLocation);
        return false;
      }
      return true;
    },
    [confirmedNavigation, location, ignorePath]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(
        lastLocation?.location?.pathname +
          (lastLocation?.location?.search || "")
      );
      setConfirmedNavigation(false);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, isBlock && !disabledBlock);

  return {
    showPrompt,
    confirmNavigation,
    cancelNavigation,
    lastPathname:
      lastLocation?.location?.pathname + (lastLocation?.location?.search || ""),
  };
}
