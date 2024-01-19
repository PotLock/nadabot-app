/**
 * Build and return a file URL using its CID information
 * @param fileCID
 * @returns
 */
export const buildFileURL = (fileCID: string) =>
  `https://ipfs.io/ipfs/${fileCID}`;
