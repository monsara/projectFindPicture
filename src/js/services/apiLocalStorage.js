import { isNumber } from "util";

const LOCALSTORAGE = (w => {
  if (!w) return;

  const isActive = "localStorage" in w;

  const get = key => {
    try {
      const serializedState = localStorage.getItem(key);
      return serializedState === null ? undefined : JSON.parse(serializedState);
    } catch (err) {
      console.error("Get state error: ", err);
    }
  };

  const set = (key, value) => {
    try {
      const serializedState = JSON.stringify(value);
      localStorage.setItem(key, serializedState);
    } catch (err) {
      console.error("Set state error: ", err);
    }
  };

  const remove = key => {
    try {
      const serializedState = localStorage.removeItem(key);
    } catch (err) {
      console.error("Get state error: ", err);
    }
  };

  const getAll = () => {
    try {
      let elements = [];
      let element = {};
      for (const key in localStorage) {
        if (!isNaN(Number(key))) {
          element = JSON.parse(localStorage.getItem(key));
          elements.push(element);
        }
      }
      return elements;
    } catch (err) {
      console.error("GetAll state error: ", err);
    }
  };

  const publicAPI = {
    isActive,
    get,
    set,
    remove,
    getAll
  };

  return publicAPI;
})(window);

export const keyLS = LOCALSTORAGE.getAll;
export const isActiveLS = LOCALSTORAGE.isActive;
export const getLS = LOCALSTORAGE.get;
export const setLS = LOCALSTORAGE.set;
export const removeLS = LOCALSTORAGE.remove;
