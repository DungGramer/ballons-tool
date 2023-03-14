import saveAs from "file-saver";
import JSZip from "jszip";
import React, { memo, useCallback, useRef, useState } from "react";
import { Step, useGlobalContext } from "../../App";
import { ImgTrans, UploadImg } from "../../services/api";
import { blobToBase64 } from "../../utils/converter";
import Process from "../process/Process";
import Toolbar from "../toolbar/Toolbar";
import "./header.scss";

const Header = () => {
  const { state, dispatch } = useGlobalContext();
  const [uploadImageAgain, setUploadImageAgain] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [startTranslate, setStartTranslate] = useState(false);

  const importImage = useCallback((e) => {
    dispatch({ type: "changeStep", value: Step.upload }); //? 1: upload
    const images = [...e.target.files];

    dispatch({ type: "setImages", value: images });

    UploadImg(images).then((res) => {
      dispatch({ type: "setProjectName", value: res }); //? 2: ready to translate
    });
  }, [state.images]);

  const translate = useCallback(() => {
    dispatch({ type: "changeStep", value: Step.translate }); //? 3: start translate
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
  }, [state.projectName]);

  const download = async () => {
    dispatch({ type: "changeStep", value: Step.download }); //? 6: download

    const zip = new JSZip();
    const imagesList = state.images.map(
      (image) => image[state.imageMode]
    ) as string[];

    imagesList.forEach((image, index) => {
      zip.file(`images/${index}.png`, blobToBase64(image));
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
      dispatch({ type: "changeStep", value: Step.downloaded }); //? 7: downloaded
    });
  };

  return (
    <header className="header">
      <div className="header-wrapper flex items-center justify-between h-full">
        <section className="flex items-center gap-2 h-full">
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
            accept="image/png, image/jpeg, image/jpg"
            onChange={importImage}
            hidden
          />

          <div className="vr" />

          <Toolbar />
        </section>
        <section className="flex gap-2">
          <button
            onClick={download}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
            disabled={state.step < Step.translated}
          >
            Download
          </button>
          <button
            onClick={translate}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
            disabled={state.step < Step.ready}
          >
            Clear Text
          </button>
        </section>
      </div>
      <Process startTranslate={startTranslate} />
    </header>
  );
};

export default memo(Header);
