import React, { useRef, useState } from "react";
import { useGlobalContext } from "../../App";
import { ImgTrans, UploadImg } from "../../services/api";
import Process from "../process/Process";
import "./header.scss";

const Header = () => {
  const { state, dispatch } = useGlobalContext();
  const [isReadyForTranslate, setIsReadyForTranslate] = useState(false);
  const [uploadImageAgain, setUploadImageAgain] = useState(false);
  const inputRef = useRef(null);

  const importImage = (e) => {
    const images = [...e.target.files];

    images.forEach((image, index) => {
      dispatch({ type: "setImage", value: {
        index,
        data: URL.createObjectURL(image)
      } });
    });

    UploadImg(images).then((res) => {
      setIsReadyForTranslate(true);
      dispatch({ type: "setProjectName", value: res });
    });

  };

  const translate = () => {
    ImgTrans(state.projectName).then((res) => {
      switch (res.code) {
        case 200:
          setUploadImageAgain(false);
          dispatch({ type: "setIsProcess", value: true });
          break;
        case 4302:
          return;
        case 4202:
          setUploadImageAgain(true);
          break;
        default:
          return alert(res.message);
      }
    });
  };

  return (
    <header className="header flex items-center justify-between">
      <button
        onClick={() => {
          if (uploadImageAgain) importImage(inputRef.current);
          inputRef.current.click();
        }}
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
        disabled={!isReadyForTranslate}
      >
        Translate
      </button>
      <Process />
    </header>
  );
};

export default Header;
