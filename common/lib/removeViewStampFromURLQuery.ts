/**
 * Remove "viewStamp" from URL query if any
 * @param queries
 * @returns
 */
const removeViewStampFromURLQuery = (queries: any) => {
  // Remove viewStamp query
  const filteredQueryKeys = Object.keys(queries).filter(
    (key) => key !== "viewStamp",
  );
  let updatedQueryBody = filteredQueryKeys.length > 0 ? "?" : "";
  filteredQueryKeys.forEach((queryKey, index) => {
    updatedQueryBody += `${queryKey}=${queries[queryKey]}`;
    if (filteredQueryKeys[index + 1]) {
      updatedQueryBody += "&";
    }
  });

  return updatedQueryBody;
};

export default removeViewStampFromURLQuery;
