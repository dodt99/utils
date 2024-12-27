import { useEffect, useState } from "react";
import { getInnerHeight, getInnerWidth } from "../../helpers/device";

const useViewport = () => {
  const [width, setWidth] = useState(getInnerWidth);
  const [height, setHeight] = useState(getInnerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(getInnerWidth());
      setHeight(getInnerHeight());
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width, height };
};

export default useViewport;
