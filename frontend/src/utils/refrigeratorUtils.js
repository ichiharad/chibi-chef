import { useState, useEffect } from 'react';

const STORAGE_KEY = 'refrigeratorContents';

const defaultIngredients = [
  { id: 1, name: "牛乳", expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 2, name: "卵", expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 3, name: "トマト", expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
];

export const useRefrigeratorContents = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const storedIngredients = getLocalStorage(STORAGE_KEY);
    if (storedIngredients && storedIngredients.length > 0) {
      setIngredients(storedIngredients);
    } else {
      setIngredients(defaultIngredients);
      setLocalStorage(STORAGE_KEY, defaultIngredients);
    }
  }, []);

  const updateIngredients = (newIngredients) => {
    setIngredients(newIngredients);
    setLocalStorage(STORAGE_KEY, newIngredients);
  };

  return [ingredients, updateIngredients];
};

export const getLocalStorage = (key) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockImageRecognition = async (imageFile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "りんご", expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "バナナ", expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "牛乳", expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      ]);
    }, 1000);
  });
};
