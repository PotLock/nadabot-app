export const updateState = (inputPayload: {}) => {
  const keys = Object.keys(inputPayload);
  const updatedState: any = {};
  keys.forEach((key) => {
    updatedState[key] = (inputPayload as any)[key];
  });
  return updatedState;
};
