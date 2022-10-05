/**
 *
 * @param enumValue
 * @param type
 */
export const getEnumToArr = <T>(
  enumValue: T,
  type: "key" | "value" = "key"
) => {
  const arr = [];
  for (let key in enumValue) {
    const keyToAny: any = key;
    if (isNaN(keyToAny)) {
      const fruitAnyType: any = enumValue[key];
      const fruitEnum: T = fruitAnyType;
      if (type === "key") {
        arr.push(keyToAny);
      } else {
        arr.push(fruitEnum);
      }
    }
  }
  return arr;
};
