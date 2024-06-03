/**
 * Get recent uploaded files CID
 * @returns
 */
export const getRecentFiles = async () => {
  try {
    const res = await fetch("/api/files");
    const json = await res.json();
    return json.files.ipfs_pin_hash;
  } catch (error) {
    console.error(error);
  }
};
