import React from "react";
import Loading from "../../UI/loading/Loading";
import "./TopSidebar.scss";
import { Tool, useGlobalContext } from "@/App";

type ToolList = Pick<
  { [key in keyof typeof Tool]: React.ReactNode },
  "clean" | "brush" | "export"
>;

const TopSidebar = () => {
  const { state } = useGlobalContext();
  const toolMode = state.toolMode;

  const Tools: ToolList = {
    [Tool.clean]: <AI />,
    [Tool.brush]: <BrushOptions />,
    [Tool.export]: <ExportOptions />,
  };

  return <div>{Tools[toolMode]}</div>;
};

const AI = () => {
  const items = [
    {
      label: "Choose mode AI:",
      component: (
        <select>
          <option value="clean-raw">Clean Raw</option>
          <option value="translate" disabled>
            Translate (Coming soon)
          </option>
        </select>
      ),
    },
    {
      label: "Choose images:",
      component: (
        <select>
          <option value="all">All Images</option>
          <option value="current">Current Image</option>
        </select>
      ),
    },
    {
      label: false,
      component: (
        <>
          <button>Run AI</button>
          <Loading />
        </>
      ),
    },
  ];

  return (
    <ListOptions>
      <div>
        <p>Choose mode AI</p>
        <select>
          <option value="clean-raw">Clean Raw</option>
          <option value="translate" disabled>
            Translate (Coming soon)
          </option>
        </select>
      </div>
      {/* <div>
        <p>Choose images</p>
        <select>
          <option value="all">All Images</option>
          <option value="current">Current Image</option>
        </select>
      </div>
      <div>
        <button>Run AI</button>
        <Loading />
      </div> */}
    </ListOptions>
  );
};

const BrushOptions = () => {
  return (
    <ListOptions>
      <div>
        <p>Brush size</p>
        <input type="range" />
        <input type="number" />
      </div>
      <div>
        <button>Healing</button>
        <label>
          <input type="checkbox" />
          Heal automatically in 01 second
        </label>
      </div>
    </ListOptions>
  );
};

const ExportOptions = () => {
  const sizes = {
    original: {
      width: 0,
      height: 0,
      title: "Original",
    },
    standard: {
      width: 640,
      height: 480,
      title: "Standard",
    },
    medium: {
      width: 1280,
      height: 720,
      title: "Medium",
    },
    high: {
      width: 1920,
      height: 1080,
      title: "High",
    },
  };

  return (
    <ListOptions>
      <div>
        <p>File type</p>
        <select>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div>
        <p>Size</p>
        <select>
          {Object.entries(sizes).map(([key, value]) => (
            <option
              value={key}
            >{`${value.title} (${value.width} x ${value.height})`}</option>
          ))}
        </select>
      </div>
      <div>
        <button>Export</button>
      </div>
    </ListOptions>
  );
};

const ListOptions = ({ children }: { children: React.ReactNode }) => {
  if (!children) return null;

  if (!Array.isArray(children)) {
    children = [children];
  }
  
  return (
    <div className="flex gap-2">
      {(children as React.ReactElement[]).map((child, index) => (
        <>
          <div className="flex gap-2">{child.props.children}</div>
          {index !== (children as any).length - 1 && <div>|</div>}
        </>
      ))}
    </div>
  );
};

export default TopSidebar;
