import { ReactComponent as HealingBrush } from "@assets/bandage.svg";
import { ReactComponent as FileExport } from "@assets/file-export.svg";
import { ReactComponent as InputText } from "@assets/input-text.svg";
import React, { useEffect } from "react";
import "./LeftSidebar.scss";
import clsx from "clsx";
import { Tool, useGlobalContext } from "@/App";
import boxModel from "../../UI/box-model/BoxModel";

const LeftSidebar = () => {
  const {
    state: { toolMode },
    dispatch,
  } = useGlobalContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const tabInkBarRef = React.useRef<HTMLDivElement>(null);
  const backgroundActiveRef = React.useRef<HTMLDivElement>(null);

  const items = [
    {
      label: "Auto AI",
      key: Tool.clean,
      icon: <img src="/ai.png" />,
      onClick: () => {},
    },
    {
      label: "Healing Brush",
      key: Tool.brush,
      icon: <HealingBrush />,
      onClick: () => {},
    },
    {
      label: "Subtitle",
      key: Tool.text,
      icon: <InputText />,
      onClick: () => {},
    },
    {
      label: "Export",
      key: Tool.export,
      icon: <FileExport />,
      onClick: () => {},
    },
  ];

  useEffect(() => {
    if (!ref.current) return;

    ref.current.childNodes.forEach((node) => {
      node.addEventListener("click", () => {
        if (!tabInkBarRef.current) return;

        const { top, height } = (
          node as HTMLDivElement
        ).getBoundingClientRect();
        tabInkBarRef.current.style.top = `${top}px`;
        tabInkBarRef.current.style.height = `${height}px`;
      });
    });
  }, []);

  return (
    <nav className="left-sidebar flex flex-col shrink-0" ref={ref}>
      {items.map((item) => (
        <div className={clsx("item-wrapper my-3")}>
          <div
            className={clsx("item flex flex-col gap-2 px-3 cursor-pointer", {
              selected: toolMode === item.key,
            })}
            onClick={() => dispatch({ type: "setTool", value: item.key })}
          >
            <div className="function-wrapper flex flex-col items-center px-2 py-2 gap-1">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </div>
        </div>
      ))}
      <div ref={tabInkBarRef} className="tab-ink-bar" />
      <div ref={backgroundActiveRef} className="background-active" />
    </nav>
  );
};

export default LeftSidebar;
