/**
 * Returns the entire document width and height
 * @returns
 */
const getDocumentResolution = () => {
  const body = document.body;
  const html = document.documentElement;

  const width = Math.max(
    body.getBoundingClientRect().width,
    html.getBoundingClientRect().width,
  );

  const height = Math.max(
    body.getBoundingClientRect().height,
    html.getBoundingClientRect().height,
  );

  return {
    width,
    height,
  };
};

export default getDocumentResolution;
