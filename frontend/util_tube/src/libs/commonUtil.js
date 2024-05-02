export const createStyleClass = (styles, classArray, className = null) => {
  let classNames = `${className ? className + " " : ""}`;

  classArray.forEach((item) => {
    classNames += `${styles[item]} `;
  });

  return classNames;
};
