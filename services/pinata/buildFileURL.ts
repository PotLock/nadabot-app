/**
 * Build and return a file URL using its CID information
 * @param fileCID
 * @returns
 */
export const buildFileURL = (fileCID: string) =>
  `https://gateway.pinata.cloud/ipfs/${fileCID}`;
