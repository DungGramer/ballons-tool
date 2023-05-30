import clsx from "clsx";
import React, { memo, useCallback, useRef } from "react";
import { Step, useGlobalContext } from "../../App";
import { UploadImg } from "../../services/api";
import useSetDragFile from "../../utils/useSetDragFile";
import "./Sidebar.scss";

const Sidebar = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const [currentIndexFocus, dragBox] = [useRef(null), useRef(null)];

  const onChangeFile = useCallback(
    (e) => {
      const files = e.target.files;
      if (files.length === 0) return;

      importImage([...files]);
    },
    [state.images]
  );

  const focusImage = (e, newIndex) => {
    if (currentIndexFocus.current === newIndex) return; //? Block focus on same image

    const oldIndex = currentIndexFocus.current;
    if (typeof oldIndex === "number" && state.step >= Step.translated) {
      dispatch({
        type: "setImageState",
        value: {
          index: oldIndex,
          data: canvasControl.exportJSON(),
        },
      });
    }
    if (state.step >= Step.translated) {
      if (state.images[newIndex]?.state) {
        canvasControl.importJSON(state.images[newIndex]?.state || "");
      } else {
        canvasControl.clear();
        canvasControl.setBackground(state.images[newIndex]?.inpainted || "");

        // if (!state.images[newIndex].imageMode) return;

        // if (["inpainted", "mask"].includes(state.images[newIndex]?.imageMode)) {
        //   canvasControl.addImage(
        //     state.images[newIndex][state.images[newIndex]?.imageMode]
        //   );
        // }
      }
    }
    canvasControl.cleanUndoStack();
    currentIndexFocus.current = newIndex;

    dispatch({
      type: "focusImage",
      value: newIndex,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const importImage = useCallback(
    (files) => {
      dispatch({ type: "changeStep", value: Step.upload }); //? 1: upload
      const images = files.sort((a, b) => a.name.localeCompare(b.name));

      dispatch({ type: "setImages", value: images });

      UploadImg(images).then((res) => {
        dispatch({ type: "setProjectName", value: res }); //? 2: ready to translate
      });
    },
    [state.images]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!inputRef.current) return;
      inputRef.current.click();
    },
    [inputRef]
  );

  useSetDragFile(dragBox, importImage);

  return (
    <div className="w-full sidebar flex h-40 gap-2">
      {state.images.length === 0 ? (
        <>
          <div
            className={clsx(
              "drag-box flex py-6 cursor-pointer flex-col items-center justify-center text-center rounded-lg border border-dashed border-gray-600 hover:bg-gray-50",
              {
                "cursor-not-allowed hover:bg-white": [
                  Step.upload,
                  Step.translate,
                ].includes(state.step),
              }
            )}
            onClick={handleClick}
            ref={dragBox}
          >
            Upload Folder
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg"
            onChange={onChangeFile}
            hidden
          />
        </>
      ) : (
        <>
          {state?.images?.map((image, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  "flex flex-col gap-2 sidebar-item cursor-pointer justify-center",
                  {
                    "border-blue-400": index === state.focusImage,
                  }
                )}
                onClick={(e) => focusImage(e, index)}
                attr-index={index + 1}
              >
                {/* <span className="text-center pt-2">{index + 1}</span> */}
                <img src={image.origin} />
                {/* <p>{image.name}</p> */}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default memo(Sidebar);
