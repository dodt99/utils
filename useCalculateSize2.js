import { ref, onMounted, onUnmounted } from "vue";
import { debounce } from "@/utils/common";

const useCalculateSize = (containerRef) => {
  const resizeObserver = ref();
  const width = ref(0);
  const height = ref(0);

  onMounted(() => {
    resizeObserver.value = new ResizeObserver(
      debounce(([entry]) => {
        const contentRect = entry.contentRect;
        const rectWidth = Math.trunc(contentRect?.width || 0);
        const rectHeight = Math.trunc(contentRect?.height || 0);
        width.value = rectWidth;
        height.value = rectHeight;
      }, 300)
    );
    resizeObserver.value.observe(containerRef.value);
  });

  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
    }
  });

  return { width, height };
};

export default useCalculateSize;
