import React, { useRef, useState } from "react";
import { Step, useGlobalContext } from "../../App";
import { ImgTrans, UploadImg } from "../../services/api";
import Process from "../process/Process";
import "./header.scss";

const Header = () => {
  const { state, dispatch } = useGlobalContext();
  const [uploadImageAgain, setUploadImageAgain] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [startTranslate, setStartTranslate] = useState(false);

  const importImage = (e) => {
    dispatch({ type: 'changeStep', value: Step.upload }); //? 1: upload
    const images = [...e.target.files];

    dispatch({ type: "setImages", value: images });

    UploadImg(images).then((res) => {
      dispatch({ type: "setProjectName", value: res }); //? 2: ready to translate
    });

  };

  const translate = () => {
    dispatch({ type: 'changeStep', value: Step.translate }); //? 3: start translate
    ImgTrans(state.projectName).then((res) => {
      switch (res.code) {
        case 200:
          setUploadImageAgain(false);
          setStartTranslate(true);
          break;
        case 4302:
          // Busy server
          return;
        case 4202:
          setUploadImageAgain(true);
          break;
        default:
          return alert(res.message);
      }
    });
  };
  console.log(state.step, Step.ready)

  return (
    <header className="header flex items-center justify-between">
      <button
        onClick={() => {
          if (!inputRef.current) return;

          if (uploadImageAgain) importImage(inputRef.current);
          inputRef.current.click();
        }}
        disabled={[Step.upload, Step.translate].includes(state.step)}
        className="border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
      >
        Import Image
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={importImage}
        hidden
      />
      <button
        onClick={translate}
        className="border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
        disabled={state.step < Step.ready}
      >
        Translate
      </button>
      <Process startTranslate={startTranslate} />
    </header>
  );
};

export default Header;
