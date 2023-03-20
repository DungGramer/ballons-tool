import React, { useCallback, useEffect, useState } from "react";
import { Step, useGlobalContext } from "../../App";
import { DownloadImageFiles, GetImgTransResult } from "../../services/api";
import { canvasControl } from "../../utils/canvas";
import invertImage from "../../utils/invertImage";
import "./Process.scss";

const Process = ({ startTranslate }) => {
  const { state, dispatch } = useGlobalContext();
  const [process, setProcess] = useState(-1);
  let interval: any = null;

  const updateProcess = useCallback(async () => {
    const result = await GetImgTransResult(state.projectName);

    setProcess(result.data.progress?.translate);

    if (result.data.status === "done") {
      clearInterval(interval);
      setProcess(-1);

      const data = result.data.result;

      dispatch({ type: "setResult", value: data }); //? 5: translated

      for (let i = 0; i < data.inpainted.length; i++) {
        const inpainted = data.inpainted[i];
        preloadImage(inpainted, "setImageInpainted", i);

        // const mask = data.mask[i];
        // preloadImage(mask, "setImageMask", i);
      }
    }
  }, [state.projectName, startTranslate]);

  const preloadImage = (
    url: string,
    type: "setImageInpainted" | "setImageMask",
    index
  ) => {
    return DownloadImageFiles(url).then((res: Blob) => {
      const url = URL.createObjectURL(res);

      switch (type) {
        case "setImageInpainted":
          dispatch({
            type,
            value: {
              index,
              data: url,
            },
          });
          break;
        case "setImageMask":
          invertImage(url).then((data) => {
            dispatch({
              type,
              value: {
                index,
                data,
              },
            });
          });
          break;
      }

      if (state.focusImage > -1 && index === state.focusImage)
        canvasControl.setBackground(url); //? Set background when image is focused

      return url;
    });
  };

  useEffect(() => {
    if (!startTranslate) return;

    dispatch({ type: "changeStep", value: Step.translating }); //? 4: translating
    interval = setInterval(() => {
      updateProcess();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTranslate]);

  if (process < 0 || process === 100) return null;
  return <progress value={process} max="100" id="progressBar" />;
};

export default Process;
