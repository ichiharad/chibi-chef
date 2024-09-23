const presetImages = [
  '/preset-recipe-1.jpg',
  '/preset-recipe-2.jpg',
  '/preset-recipe-3.jpg',
  '/preset-recipe-4.jpg',
];

export const getRandomPresetImage = () => {
  const randomIndex = Math.floor(Math.random() * presetImages.length);
  return presetImages[randomIndex];
};
