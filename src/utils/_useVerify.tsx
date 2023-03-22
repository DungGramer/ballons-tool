import { useCallback, useEffect, useRef, useState } from "react";
import generateUuid from "./encodeString";
import { CookieStore, LocalStore, SessionStore } from "./storages";
import uuidv4, { randomTime } from "./uuidv4";

const validKey = [
  "MMvCke",
  "SDWJnE",
  "u3ku8H",
  "STfd2n",
  "qCQufF",
  "SGuVve",
  "szEpCA",
  "uPAmFr",
  "yMB4yX",
  "bUFLkz",
];
const validTimeKey = generateUuid("exp_time");
const validateKey = generateUuid("validate");
const timeRepeat = 1000 * 60; // 1 minute
const timeBlock = 1000 * 60 * 30; // 30 minutes

function useVerify() {
  const [value, setValue] = useState("");
  const [times, currentTiming] = [useRef(-1), useRef(new Date().getTime())];
  const [result, setResult] = useState<any>();
  const [invalid, setInvalid] = useState(false);

  const verify = useCallback(() => {
    const hasVerify = CookieStore.get(validateKey) || LocalStore.get(validateKey) || SessionStore.get(validateKey);
    if (hasVerify) {
      setResult(true);
      return true;
    }

    const hasLimit = CookieStore.get(validTimeKey);
    if (new Date().getTime() < hasLimit) {
      //? Reopen after 30 minutes from exp_time
      setResult(false);
      return false;
    }

    const valid = validKey.includes(value);
    if (valid) {
      CookieStore.clear();
      LocalStore.clear();
      SessionStore.clear();
      times.current = 0;

      CookieStore.set(validateKey, true);
      LocalStore.set(validateKey, true);
      SessionStore.set(validateKey, true);
      setResult(true);
      setInvalid(false);
      window.location.reload();
      return true;
    }
    if (times.current > 0) setInvalid(true);
    
    times.current += 1;
    // Reset times after 1 minute
    if (new Date().getTime() - currentTiming.current > timeRepeat) {
      times.current = 0;
      currentTiming.current = new Date().getTime();
    }

    if (
      times.current > 10 &&
      new Date().getTime() - currentTiming.current < timeRepeat
    ) {
      alert("You have tried too many times. Please try again later.");
      // Reopen after 30 minutes from now
      CookieStore.set(validTimeKey, new Date().getTime() + timeBlock);
      addTrashStore();

      setResult(false);
      return false;
    }

    setResult(null);
    return null;
  }, [value]);

  useEffect(() => {
    verify();
  }, [value]);

  return [value, setValue, result, invalid];
}

const addTrashStore = () => {
  for (let i = 0; i < 100; i++) {
    CookieStore.set(uuidv4(), randomTime());
    LocalStore.set(uuidv4(), randomTime());
    SessionStore.set(uuidv4(), randomTime());
  }
};

export default useVerify;
