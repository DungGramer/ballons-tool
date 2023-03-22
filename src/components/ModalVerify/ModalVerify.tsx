import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useVerify from "../../utils/useVerify";
import "./ModalVerity.scss";

const ModalVerify = () => {
  const [value, setValue, result, invalid] = useVerify();
  const ref = useRef<HTMLInputElement>(null);

  const handleEnter = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setValue(ref.current?.value);
    }
  }, []);

  const handleVerify = useCallback(() => {
    setValue(ref.current?.value);
  }, []);

  const disabled = useMemo(() => {
    return result === false;
  }, [result]);

  return (
    <div className="modal-verify">
      <div className="modal-verify__content">
        <h1 className="text-2xl font-bold">Verify</h1>
        <p className="text-gray-500">
          {disabled
            ? "You have tried too many times. Please try again after 30 minutes."
            : "Please enter the verification code to continue"}
        </p>
        <input
          type="text"
          className={clsx("w-full mt-4 p-2 border border-gray-300 rounded-md", {
            "border-red-500 cursor-not-allowed": disabled,
            "border-red-300 outline-red-300": invalid,
          })}
          placeholder="Verification code"
          ref={ref}
          onKeyDown={handleEnter}
          disabled={disabled}
        />
        <div className="flex justify-end mt-4">
          <button
            className="border border-gray-300 rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleVerify}
            disabled={disabled}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerify;
