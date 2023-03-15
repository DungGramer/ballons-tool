import React, { memo, useCallback, useRef } from "react";
import { Step, useGlobalContext } from "../../App";
import { UploadImg } from "../../services/api";
import "./Sidebar.scss";

const Sidebar = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const currentIndexFocus = useRef(null);

  const focusImage = (e, newIndex) => {
    if (currentIndexFocus.current === newIndex) return; //? Block focus on same image

    const oldIndex = currentIndexFocus.current;

    console.log(canvasControl.exportJSON());
    if (typeof oldIndex === "number") {
      dispatch({
        type: "setImageState",
        value: {
          index: oldIndex,
          data: canvasControl.exportJSON(),
        },
      });
    }
    if (state.images[newIndex]?.state) {
      canvasControl.importJSON(state.images[newIndex]?.state);
    } else {
      canvasControl.clear();
      canvasControl.setBackground(state.images[newIndex].origin || "");

      if (["inpainted", "mask"].includes(state.imageMode)) {
        canvasControl.addImage(state.images[newIndex][state.imageMode] || "");
      }
    }

    currentIndexFocus.current = newIndex;

    dispatch({
      type: "focusImage",
      value: newIndex,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const importImage = useCallback(
    (e) => {
      dispatch({ type: "changeStep", value: Step.upload }); //? 1: upload
      const images = [...e.target.files].sort((a, b) => a.name.localeCompare(b.name));

      dispatch({ type: "setImages", value: images });

      UploadImg(images).then((res) => {
        dispatch({ type: "setProjectName", value: res }); //? 2: ready to translate
      });
    },
    [state.images]
  );

  return (
    <div className="max-w-xs w-1/3 sidebar h-screen flex flex-col">
      {state.images.length === 0 ? (
        <>
          <button
            onClick={() => {
              if (!inputRef.current) return;

              // if (uploadImageAgain) importImage(inputRef.current);
              inputRef.current.click();
            }}
            disabled={[Step.upload, Step.translate].includes(state.step)}
            className="border border-gray-300 border-dashed rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100 mt-5"
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
        </>
      ) : (
        <>
          {state?.images?.map((image, index) => {
            return (
              <div key={index} className="flex flex-col gap-2 sidebar-item">
                <img
                  src={image.origin}
                  alt={image.name}
                  onClick={(e) => focusImage(e, index)}
                />
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
