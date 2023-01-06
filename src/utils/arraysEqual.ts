interface equalObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const arraysEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      if (typeof arr1[i] === "object" && typeof arr2[i] === "object") {
        if (!objectsEqual(arr1[i], arr2[i])) return false;
      } else {
        return false;
      }
    }
  }

  return true;
};

const objectsEqual = (obj1: equalObject, obj2: equalObject): boolean => {
  const obj1Props = Object.getOwnPropertyNames(obj1);
  const obj2Props = Object.getOwnPropertyNames(obj2);

  if (obj1Props.length !== obj2Props.length) return false;

  for (const prop of obj1Props) {
    if (obj1[prop] !== obj2[prop]) return false;
  }

  return true;
};
