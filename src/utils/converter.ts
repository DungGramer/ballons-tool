export function blobToBase64(blobURL: string) {
  return fetch(blobURL).then((res) => res.blob());
}