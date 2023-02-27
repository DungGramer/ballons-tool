import { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";
import "./App.css";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import Zoom from "./components/zoom/Zoom";
import { canvasControl } from './utils/canvas';

function App() {
  return (
    <div className='App h-screen flex flex-col'>
      <GlobalProvider>
        <Header />
        <section className='flex gap-2 flex-auto'>
          <Sidebar />
          <Main />
          <Zoom />
        </section>
      </GlobalProvider>
    </div>
  );
}

const GlobalContext = createContext();

const reducer = (draft, action) => {
  switch (action.type) {
    case "setImage":
      draft.images[action.value.index] = { origin: action.value.data };
      return;
    case "setImagesInpainted":
      draft.images[action.value.index].inpainted = action.value.data;
      return;
    case "setImagesMask":
      draft.images[action.value.index].mask = action.value.data;
      return;
    case 'setProjectName':
      draft.projectName = action.value?.data?.project_name;
      return;
    case 'focusImage':
      draft.focusImage = action.value;
      return;
    case 'setIsProcess':
      draft.isProcess = action.value;
      return;
    case 'setProcess':
      draft.process = action.value?.data?.process;
      return;
    case 'setResult':
      draft.inpainted = action.value?.inpainted;
      draft.mask = action.value?.mask;
      draft.trans = action.value?.trans;
      return;
    case 'changeFocusImage':
      draft.imageMode = action.value;
    default:
      return draft;
  }
};

const initialState = {
  someState: "someValue",
  process: -1,
  projectName: '',
  isProcess: false,
  images: [],
  imageMode: 'origin',
};

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch, canvasControl }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default App;
