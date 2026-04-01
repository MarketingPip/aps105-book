/**
 * A storage wrapper that defaults to localStorage but falls back to 
 * an in-memory Map if localStorage is unavailable or restricted.
 */
const storage = (() => {
  const isAvailable = typeof window !== 'undefined' && (() => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  })();

  if (isAvailable) {
    return window.localStorage;
  }

  // Mock implementation matching the Storage interface
  const memoryStore = new Map();

  return {
    getItem: (key) => (memoryStore.has(String(key)) ? memoryStore.get(String(key)) : null),
    setItem: (key, value) => memoryStore.set(String(key), String(value)),
    removeItem: (key) => memoryStore.delete(String(key)),
    clear: () => memoryStore.clear(),
    key: (index) => Array.from(memoryStore.keys())[index] || null,
    get length() {
      return memoryStore.size;
    }
  };
})();

export default storage;
