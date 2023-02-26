import React from "react";
import { useGlobalContext } from "../../App";
import { UploadImg } from "../../services/api";
import Process from "../process/Process";
import "./header.scss";

const Header = () => {
  const { state, dispatch } = useGlobalContext();

  const importImage = () => {
    const input = document.createElement("input");
    // Import multiple images
    input.multiple = true;
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = e.target.files;
      const images = [...files];
      console.log(images);
      dispatch({ type: "setImage", value: images });

      UploadImg(images).then((res) => {
        dispatch({ type: "setProjectName", value: res });
      });
    };
    input.click();
  };

  const translate = () => {
    ImgTrans(state.projectName).then((res) => {
      dispatch({ type: "setProcess", value: res });
    });
  };

  return (
    <header className='header flex items-center justify-between'>
      <button
        onClick={importImage}
        className='border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100'
      >
        Import Image
      </button>
      <button
        onClick={translate}
        className='border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100'
      >
        Translate
      </button>
      <Process />
    </header>
  );
};

export default Header;
