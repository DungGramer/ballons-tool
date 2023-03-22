function uuidv4() {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function randomTime() {
  return Math.floor(Math.random() * 10000000000000);
}

export default uuidv4;
