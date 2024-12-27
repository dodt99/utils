import { useEffect, useState } from "react";

const useDevicePixelRatio = () => {
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    getDevicePixelRatio()
  );

  useEffect(() => {
    const handleWindowResize = () => setDevicePixelRatio(getDevicePixelRatio());
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return devicePixelRatio;
};

export default useDevicePixelRatio;

//

const devicePixelRatio = useDevicePixelRatio();

useEffect(() => {
  if (devicePixelRatio) {
    document.body.style.zoom = `${100 / devicePixelRatio}%`;
  }
}, [devicePixelRatio]);
