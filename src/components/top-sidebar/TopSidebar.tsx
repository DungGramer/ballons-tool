import React from "react";
import Loading from "../../UI/loading/Loading";

const TopSidebar = () => {
  return (
    <div>
      <AI />
    </div>
  );
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
    <div className="flex gap-2">
      {items.map((item) => (
        <div className="item flex gap-2 items-center justify-center text-center p-3 cursor-pointer">
          {item.label && <span>{item.label}</span>}
          {item.component}
        </div>
      ))}
    </div>
  );
};

export default TopSidebar;
