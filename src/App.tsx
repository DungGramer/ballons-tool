import React, { createContext, useContext, useMemo } from "react";
import { useImmerReducer } from "use-immer";
import "./App.css";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import Sidebar from "./components/sidebar/Sidebar";
import Toolbar from "./components/toolbar/Toolbar";
import Zoom from "./components/zoom/Zoom";
import { canvasControl } from "./utils/canvas";

function App() {
  return (
    <div className="App h-screen flex flex-col">
      <GlobalProvider>
        <Header />
        <section className="flex gap-2">
          <Toolbar />
          <Sidebar />
          <Main />
          <RightSidebar />
          <Zoom />
        </section>
      </GlobalProvider>
    </div>
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
    | "changeImageMode";
  value: any;
}
export enum Step {
  select = 0,
  upload,
  ready,
  translate,
  translating,
  translated,
  download,
  downloaded,
}

export enum Tool {
  brush = "brush",
  eraser = "eraser",
  text = "text",
}

type ImageMode = "origin" | "inpainted" | "mask";

interface Draft {
  images: { origin?: string; inpainted?: string; mask?: string; state?: string, imageMode?: ImageMode }[];
  projectName: string;
  process: number;
  focusImage: number;
  imageMode: ImageMode;
  inpainted: string[];
  mask: string[];
  trans: string;
  step: Step;
  toolMode: Tool;
}

// Step flow: 0.select -> 1.upload -> 2.ready -> 3.translate -> 4.translating -> 5.translated -> 6.download -> 7.downloaded

const reducer = (draft: Draft, action: Action) => {
  switch (action.type) {
    case "setImages":
      draft.images = [];
      draft.step = Step.upload;
      action.value.forEach((image, index) => {
        draft.images[index] = { origin: URL.createObjectURL(image) };
      });
      return;
    case "setImageInpainted":
      draft.images[action.value.index].inpainted = action.value.data;
      return;
    case "setImageMask":
      draft.images[action.value.index].mask = action.value.data;
      return;
    case 'setImageState':
      draft.images[action.value.index].state = action.value.data;
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
      draft.imageMode = action.value;
      return;
    case "changeStep":
      draft.step = action.value;
      return;
    case "setTool":
      draft.toolMode = action.value;
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
};

const GlobalContext = createContext({});

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useImmerReducer<any, any>(reducer, initialState);

  const memoizedValue = useMemo(
    () => ({ state, dispatch, canvasControl }),
    [state, dispatch, canvasControl]
  );

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
