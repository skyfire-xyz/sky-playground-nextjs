export function scrollToBottom(refs: any, stopScroll: () => void) {
  refs.forEach((ref: { current: HTMLDivElement }) => {
    ref.current?.scrollTo({ top: 99999, behavior: "smooth" });
  });

  // Account for image load
  const timer = setInterval(() => {
    refs.forEach((ref: { current: HTMLDivElement }) => {
      ref.current?.scrollTo({ top: 99999, behavior: "smooth" });
    });
  }, 200);
  setTimeout(() => {
    clearInterval(timer);
    stopScroll();
  }, 600);
}
