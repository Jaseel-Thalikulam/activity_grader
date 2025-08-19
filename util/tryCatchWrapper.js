export const tryCatchWrapper = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`❌ Error in ${fn.name}:`, error.message);
      throw error;
    }
  };
};
