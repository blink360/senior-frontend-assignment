export const storeItemInLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
  return;
};

export const getItemFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);

  if (item) {
    return JSON.parse(item);
  }
  return null;
};

export const removeItemFromLocalStorage = (key: string) => {
  const item = getItemFromLocalStorage(key);

  if (item) {
    localStorage.removeItem(key);
    return;
  }
};
