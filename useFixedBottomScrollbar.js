import { useEffect } from "react";

const createFixedScrollbar = () => {
  const scrollbar = document.createElement("div");
  const scrollbarContent = document.createElement("div");
  scrollbar.appendChild(scrollbarContent);
  document.body.appendChild(scrollbar);

  scrollbar.id = "fixed-scrollbar";
  scrollbar.style.overflowX = "auto";
  scrollbar.style.position = "fixed";
  scrollbar.style.width = "100%";
  scrollbar.style.bottom = "0";
  scrollbar.style.display = "none";

  return { scrollbar, scrollbarContent };
};

const top = (el) => el.getBoundingClientRect().top + window.scrollY;
const bottom = (el) => top(el) + el.offsetHeight;

const useFixedBottomScrollbar = (elSelector = ".fixed-scrollbar") => {
  useEffect(() => {
    const { scrollbar, scrollbarContent } = createFixedScrollbar();
    const scrollElements = [...document.querySelectorAll(elSelector)];

    let activeElement;

    const findActiveElement = () => {
      scrollbar.style.display = "block";
      const element = scrollElements.find(
        (el) =>
          el.scrollWidth > el.clientWidth &&
          top(el) < top(scrollbar) &&
          bottom(el) > bottom(scrollbar)
      );
      scrollbar.style.display = "none";
      return element;
    };

    const updateScrollbarStyle = () => {
      if (activeElement) {
        scrollbar.style.left =
          activeElement.getBoundingClientRect().left + window.scrollX + "px";
        scrollbar.style.width = activeElement.offsetWidth + "px";
        scrollbarContent.style.width = activeElement.scrollWidth + "px";
        scrollbarContent.style.height = "1px";
        scrollbar.style.display = "block";
      } else {
        scrollbar.style.display = "none";
      }
    };

    const updateScrollbarLeft = () => {
      scrollbar.scrollLeft = activeElement.scrollLeft;
    };

    const listenObserver = () => {
      const newActiveElement = findActiveElement();
      const isChangeActive = activeElement !== newActiveElement;

      //Cleanup old activeElement
      if (activeElement && isChangeActive) {
        activeElement.removeEventListener("scroll", updateScrollbarLeft);
      }

      activeElement = newActiveElement;

      updateScrollbarStyle();

      if (newActiveElement && isChangeActive) {
        updateScrollbarLeft();
        activeElement.addEventListener("scroll", updateScrollbarLeft);
      }
    };

    const onScrollbarScroll = () => {
      activeElement.scrollLeft = scrollbar.scrollLeft;
    };

    window.addEventListener("scroll", listenObserver);
    const resizeObserver = new ResizeObserver(listenObserver);
    scrollElements.forEach((el) => resizeObserver.observe(el));

    scrollbar.addEventListener("scroll", onScrollbarScroll);

    return () => {
      scrollbar.remove();
      window.removeEventListener("scroll", listenObserver);
      resizeObserver.disconnect();
    };
  }, [elSelector]);
};

export default useFixedBottomScrollbar;
