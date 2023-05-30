import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import "./App.css";
import ModalVerify from "./components/ModalVerify/ModalVerify";
import Header from "./components/header/Header";
import LeftSidebar from "./components/left-sidebar/LeftSidebar";
import Main from "./components/main/Main";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import { canvasControl, initDispatch } from "./utils/canvas";
import useVerify from "./utils/useVerify";

function App({ children }) {
  const [, , result] = useVerify();

  return (
    <div className="App h-screen flex flex-col">
      <GlobalProvider>{result ? <AppChild /> : <ModalVerify />}</GlobalProvider>
    </div>
  );
}

function AppChild() {
  const { state } = useGlobalContext();
  const toolMode = state.toolMode;

  return (
    <>
      <Header />
      <section className="flex gap-2 main-wrapper">
        <LeftSidebar />
        <Main />
        {toolMode && <RightSidebar />}
      </section>
    </>
    // <div className="App h-screen flex flex-col">
    //   <GlobalProvider>
    //     {result ? (
    //       <>
    //         <Header />
    //         <section className="flex gap-2 main-wrapper">
    //           <LeftSidebar />
    //           <Main />
    //           <RightSidebar />
    //         </section>
    //       </>
    //     ) : (
    //       <ModalVerify />
    //     )}
    //   </GlobalProvider>
    // </div>
  );
}

interface Action {
  type:
    | "setImageInpainted"
    | "setImageMask"
    | "setImageState"
    | "setProjectName"
    | "focusImage"
    | "setResult"
    | "changeStep"
    | "setImages"
    | "setTool"
    | "setUndo"
    | "setExportImage"
    | "undo"
    | "changeImageMode";
  value: any;
}
export enum Step {
  select,
  upload,
  ready,
  translate,
  translating,
  translated,
  download,
  downloaded,
}
// Step flow: 0.select -> 1.upload -> 2.ready -> 3.translate -> 4.translating -> 5.translated -> 6.download -> 7.downloaded

export enum Tool {
  brush = "brush",
  eraser = "eraser",
  text = "text",
  clean = "clean",
  export = "export",
}

type ImageMode = "origin" | "inpainted" | "mask";

export interface Draft {
  images: {
    origin?: string;
    inpainted?: string;
    mask?: string;
    state?: string;
    imageMode?: ImageMode;
    undoState?: string[];
    export?: string;
  }[];
  projectName: string;
  process: number;
  focusImage: number;
  inpainted: string[];
  mask: string[];
  trans: string;
  step: Step;
  toolMode: Tool;
}

const reducer = (draft: Draft, action: Action) => {
  console.log(`📕 action.type - 93:App.tsx \n`, action.type);
  switch (action.type) {
    case "setImages":
      draft.images = [];
      draft.step = Step.upload;
      action.value.forEach((image, index) => {
        draft.images[index] = {
          origin: URL.createObjectURL(image),
          imageMode: "origin",
          undoState: [],
          export: "",
        };
      });
      return;
    case "setImageInpainted":
      draft.images[action.value.index].inpainted = action.value.data;
      return;
    case "setImageMask":
      draft.images[action.value.index].mask = action.value.data;
      return;
    case "setImageState":
      draft.images[action.value.index].state = action.value.data;
      return;
    case "setExportImage":
      if (draft.images?.length && draft.focusImage !== -1) {
        draft.images[draft.focusImage].export = action.value;
      }
      return;
    case "setProjectName":
      draft.projectName = action.value?.data?.project_name;
      draft.step = Step.ready;
      return;
    case "focusImage":
      draft.focusImage = action.value;
      return;
    case "setResult":
      draft.inpainted = action.value?.inpainted;
      draft.mask = action.value?.mask;
      draft.trans = action.value?.trans;
      draft.step = Step.translated;
      return;
    case "changeImageMode":
      draft.images[action.value.index].imageMode = action.value.mode;
      return;
    case "changeStep":
      draft.step = action.value;
      return;
    case "setTool":
      draft.toolMode = action.value;
      return;
    case "setUndo":
      if (!draft.images?.length || draft.focusImage === -1) return;
      // if (Array.isArray(draft.images[draft.focusImage]?.undoState))
      console.log(`📕 action.value - 146:App.tsx \n`, action.value);
      if (Array.isArray(action.value))
        draft.images[draft.focusImage].undoState = action.value;
      else draft.images[draft.focusImage].undoState.push(action.value);
      return;
    case "undo":
      console.log(`📕 undo - 151:App.tsx \n`);
      if (!draft.images?.length || draft.focusImage === -1) return;
      draft.images[draft.focusImage].undoState = action.value;
      return;
    default:
      return draft;
  }
};

const initialState = {
  process: -1,
  projectName: "",
  images: [],
  imageMode: "origin",
  step: Step.select,
  focusImage: -1,
};

const GlobalContext = createContext({});

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useImmerReducer<any, any>(reducer, initialState);
  const [CV, setSV] = useImmer(null);

  const memoizedValue = useMemo(
    () => ({ state, dispatch, canvasControl }),
    [state, dispatch, canvasControl]
  );

  useEffect(() => {
    initDispatch(state, dispatch);
  }, []);

  useEffect(() => {
    canvasControl.setCanvasState(state);
  }, [state]);

  // useEffect(() => {
  //   console.log(`📕 CV - 150:App.tsx \n`, CV);
  // }, [CV]);

  return (
    <GlobalContext.Provider value={memoizedValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext) as {
    state: Draft;
    dispatch: React.Dispatch<Action>;
    canvasControl: typeof canvasControl;
  };
};

export default App;
