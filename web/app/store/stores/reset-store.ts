export const storeResetFns = new Set<() => void>();

export const resetAllStore = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};
