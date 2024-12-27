import { ref, onMounted, onUnmounted } from "vue";
import { debounce } from "@/utils/common";

const useViewport = () => {
  const width = ref(0);
  const height = ref(0);

  const handleResize = debounce(() => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }, 300);

  onMounted(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return { width, height };
};

export default useViewport;
