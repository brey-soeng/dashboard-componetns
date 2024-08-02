import { ref, onMounted, onUnmounted } from "vue";

export function useNetworkInformation() {
  const networkState = ref({
    isOnline: navigator.onLine,
    effectiveType: "",
    downlink: 0,
    rtt: 0,
  });

  const updateNetState = () => {
    const connection = navigator.connection;
    if (connection) {
      networkState.value = {
        isOnline: navigator.onLine,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
  };

  onMounted(() => {
    window.addEventListener("load", updateNetState);
    window.addEventListener("online", updateNetState);
    window.addEventListener("offline", updateNetState);
  });

  onUnmounted(() => {
    window.removeEventListener("load", updateNetState);
    window.removeEventListener("online", updateNetState);
    window.removeEventListener("offline", updateNetState);
  });

  return networkState;
}
