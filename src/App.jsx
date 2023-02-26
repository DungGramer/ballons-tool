import { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";
import "./App.css";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import Zoom from "./components/zoom/Zoom";
import CanvasControl from "./utils/canvas";

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
      draft.images = action.value;
      return;
    case 'setProjectName':
      draft.projectName = action.value?.data?.project_name;
      return;
    case 'focusImage':
      draft.focusImage = action.value;
      return;
    case 'setProcess':
      draft.process = action.value?.data?.process;
      return;
    default:
      return draft;
  }
};

const initialState = {
  someState: "someValue",
  process: -1,
  projectName: ''
};

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const canvasControl = new CanvasControl();

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
