import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../../App";
import { DownloadImageFiles, GetImgTransResult } from "../../services/api";
import invertImage from "../../utils/invertImage";
import "./Process.scss";

const Process = () => {
  const { state, dispatch } = useGlobalContext();
  const [process, setProcess] = useState(-1);
  let interval: any = null;

  const updateProcess = useCallback(async () => {
    const result = await GetImgTransResult(state.projectName);

    setProcess(result.data.progress?.translate);

    if (result.data.status === "done") {
      clearInterval(interval);
      setProcess(-1);

      dispatch({
        type: "setResult",
        value: result.data.result,
      });

      for (let i = 0; i < result.data.result.inpainted.length; i++) {
        const inpainted = result.data.result.inpainted[i];
        const mask = result.data.result.mask[i];

        preloadImage(inpainted, "setImagesInpainted", i);
        preloadImage(mask, "setImagesMask", i);
      }
    }
  }, [state.projectName, state.isProcess]);

  const preloadImage = (
    url: string,
    type: "setImagesInpainted" | "setImagesMask",
    index
  ) => {
    DownloadImageFiles(url).then((res: Blob) => {
      const url = URL.createObjectURL(res);

      switch (type) {
        case "setImagesInpainted":
          dispatch({
            type,
            value: {
              index,
              data: url,
            },
          });
          break;
        case "setImagesMask":
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
    });
  };

  useEffect(() => {
    if (!state.isProcess) return;

    interval = setInterval(() => {
      updateProcess();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [state.isProcess]);

  if (process < 0 || process === 100) return null;

  return <progress value={process} max="100" id="progressBar" />;
};

export default Process;
