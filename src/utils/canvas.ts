import { fabric } from "fabric";
import { Draft } from "../App";
import { postPath } from "../services/api";
import { Image } from "fabric/fabric-impl";

class CanvasControl {
  canvasElement: HTMLCanvasElement;
  wrapperElement: HTMLDivElement;
  canvas: fabric.Canvas;
  image: string;
  toggleText: boolean = false;
  undoStack: any[] = [];
  redoStack: any[] = [];
  pauseSaving: boolean = false;
  isRestore: boolean = false;
  width: number;
  height: number;
  focusImage: number;
  state: Draft;
  dispatch: any;

  constructor() {}

  init(canvasRef: HTMLCanvasElement, wrapperRef: HTMLDivElement) {
    that.canvasElement = canvasRef;
    that.wrapperElement = wrapperRef;

    if (that.canvas) return;

    that.canvas = new fabric.Canvas(that.canvasElement, {
      selection: false,
      width: that.wrapperElement.clientWidth,
      height: that.wrapperElement.clientHeight,
    });

    that.canvas.on("object:added", (e) => {
      const imageType = e.target?.cacheKey === "image-overlay";
      const pathType = Boolean(e.target?.path);
      console.log(
        `📕 that.pauseSaving - 38:canvas.ts \n`,
        that.isRestore,
        that.pauseSaving
      );
      if (that.pauseSaving || that.isRestore) return;

      // console.log(`📕 e - 29:canvas.ts \n`, e.target);
      console.log(`📕 added \n`, that.undoStack, that.redoStack);

      if (imageType) return;

      if (pathType) {
        postPath(e.target).then((res) => {
          that.addImage(res.image);

          // Remove path
          that.canvas.remove(e.target);
        });
      }

      that.undoStack.push(that.exportJSON());
      that.onChanges();
      that.redoStack = [];
    });

    that.canvas.on("object:modified", (e) => {
      const imageType = e.target?.cacheKey === "image-overlay";
      if (that.pauseSaving || that.isRestore) return;

      console.log(`📕 modified \n`, that.undoStack, that.redoStack);
      if (imageType) return;

      that.undoStack.push(that.exportJSON());
      that.onChanges();
      that.redoStack = [];
    });

    that.canvas.on("object:removed", (e) => {
      const imageType = e.target?.cacheKey === "image-overlay";
      const pathType = Boolean(e.target?.path);
      if (that.pauseSaving || that.isRestore) return;
      if (pathType) return;

      console.log(`📕 removed \n`, that.undoStack, that.redoStack);
      if (imageType) return;

      that.undoStack.push(that.exportJSON());
      that.redoStack = [];
    });
  }

  onChanges() {
    if (!that.canvas || that.dispatch instanceof Function === false) return;

    that.dispatch({ type: "setUndo", value: that.exportJSON() });
    that.dispatch({
      type: "setExportImage",
      value: that.exportCanvasToImage(),
    });
  }

  initSetState(state, dispatch) {
    that.state = state;
    that.dispatch = dispatch;
  }

  setCanvasState(state) {
    that.state = state;
  }

  setBackground(url: string) {
    that.removeOldImage();
    fabric.Image.fromURL(url, (img) => {
      that.image = url;
      that.canvas.setBackgroundImage(
        img,
        that.canvas.renderAll.bind(that.canvas)
      );
      that.zoom("fit");
    });
  }

  hasBackground() {
    return !!that.canvas.backgroundImage;
  }

  zoom(type: "fit" | "zoomIn" | "zoomOut" | "reset" | "fill") {
    if (!that.canvas.backgroundImage) return;
    const img = (that.canvas.backgroundImage as Image).getElement();

    const { width, height } = img;
    const [widthCanvas, heightCanvas] = [
      that.canvas.getWidth(),
      that.canvas.getHeight(),
    ];

    switch (type) {
      case "fill":
        // Fill width image with width canvas

        if (width > height) {
          // Landscape
          that.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          that.canvas.setZoom(widthCanvas / width);
        }
        that.canvas.setHeight(height * that.canvas.getZoom());

        that.canvas.absolutePan({
          y: 0,
          x: 0,
        });

        return;
      case "zoomIn":
        const zoomRatio = that.canvas.getZoom() + 0.05;
        const center = that.canvas.getCenter();
        that.canvas.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoomRatio
        );
        return;
      case "zoomOut":
        const zoomRatioOut = that.canvas.getZoom() - 0.05;
        const centerOut = that.canvas.getCenter();
        that.canvas.zoomToPoint(
          new fabric.Point(centerOut.left, centerOut.top),
          zoomRatioOut
        );
        return;
      case "reset":
      case "fit":
      default:
        // Fit height image with height canvas
        that.canvas.setHeight(that.wrapperElement.clientHeight);

        if (width > height) {
          // Landscape
          that.canvas.setZoom(widthCanvas / width);
        } else {
          // Portrait
          that.canvas.setZoom(widthCanvas / width);
        }

        // Set center image
        that.canvas.absolutePan({
          y: (height / 2) * that.canvas.getZoom() - heightCanvas / 2,
          x: (width / 2) * that.canvas.getZoom() - widthCanvas / 2,
        });

        return;
    }
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      const fabricImage = new fabric.Image(img.getElement(), {
        selectable: false,
        evented: false,
        cacheKey: "image-overlay",
      });

      that.removeOldImage();
      that.canvas.add(fabricImage);
      that.setAutoLayer();

      // Add export image
      that.dispatch({
        type: "setExportImage",
        value: that.exportCanvasToImage(),
      });
    });
  }

  removeOldImage() {
    Array.from(that.canvas.getObjects()).forEach((obj) => {
      if (obj.type === "image") {
        that.canvas.remove(obj);
      }
    });
  }

  addBrush() {
    // if (this.canvas.isDrawingMode) {
    //   this.canvas.isDrawingMode = false;
    //   return;
    // }

    const [brushSize, brushColor] = [Math.round(25 / 1.8), "rgba(0,0,0,.5)"];

    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.color = brushColor;
    this.canvas.freeDrawingBrush.width = brushSize;

    // set cursor size
    this.canvas.freeDrawingCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}'><circle cx='${
      brushSize / 2
    }' cy='${brushSize / 2}' r='${
      brushSize / 2
    }' fill='${brushColor}' /></svg>") ${brushSize / 2} ${brushSize / 2}, auto`;
  }

  disableBrush() {
    this.canvas.isDrawingMode = false;
  }
  setBrushSize(size: number) {
    that.canvas.freeDrawingBrush.width = size;

    // set cursor size
    const cursorSize = Math.round(size / 1.8);
    that.canvas.freeDrawingCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}'><circle cx='${
      cursorSize / 2
    }' cy='${cursorSize / 2}' r='${
      cursorSize / 2
    }' fill='rgba(0, 0, 0, 0.5)' /></svg>") ${cursorSize / 2} ${
      cursorSize / 2
    }, auto`;
  }

  addText() {
    const center = that.canvas.getCenter();
    that.canvas.add(
      new fabric.IText("Tap and Type", {
        left: center.left,
        top: center.top,
        fontFamily: "Helvetica",
        fill: "#000",
        fontSize: 40,
        textAlign: "center",
      })
    );
  }

  editText(config: { fill?: string }) {
    const active = that.canvas.getActiveObject();
    if (active && active.type === "i-text") {
      active.set(config);
      that.canvas.renderAll();
    }
  }

  undo() {
    that.pauseSaving = true;
    const undoState = [...that.state.images[that.state.focusImage].undoState];
    const state = undoState.pop();
    if (!state) return (that.pauseSaving = false);
    that.redoStack.push(state);

    that.canvas.loadFromJSON(state, () => {
      that.canvas.renderAll();
      that.pauseSaving = false;

      that.dispatch({
        type: "setExportImage",
        value: that.exportCanvasToImage(),
      });

      that.dispatch({ type: "undo", value: undoState });
    });
  }

  redo() {
    that.pauseSaving = true;
    const state = that.redoStack.pop();
    if (state) {
      that.undoStack.push(state);
      that.canvas.loadFromJSON(state, () => {
        that.canvas.renderAll();
        that.pauseSaving = false;
      });
    }
  }

  shortcut(e: KeyboardEvent) {
    const activeObj = that.canvas.getActiveObject();
    const notEditText = activeObj?.isEditing;

    if (e.key === "z" && e.ctrlKey) {
      that.undo();
    } else if (e.key === "y" && e.ctrlKey) {
      that.redo();
    } else if (e.key === "t" && e.ctrlKey) {
      that.addText();
    } else if (e.key === "Delete" && !notEditText) {
      that.canvas.remove(that.canvas.getActiveObject() as any);

      that.dispatch({
        type: "setExportImage",
        value: that.exportCanvasToImage(),
      });
    }
  }

  mouseWheel(e: WheelEvent) {
    // Get image object
    const imageLayer = that.canvas
      .getObjects()
      .find((obj) => obj.type === "image");

    if (imageLayer) {
      // Set image is active
      that.canvas.setActiveObject(imageLayer);
    }

    // const imageLayer = that.canvas.getActiveObject();
    if (imageLayer && imageLayer.type === "image") {
      const opacity = imageLayer.get("opacity") || 1;

      const opacityResult = opacity + e.deltaY / 2500;
      if (opacityResult < 0 || opacityResult > 1) return;

      imageLayer.set({ opacity: opacityResult });
      that.canvas.renderAll();
    }
  }

  exportJSON() {
    return that.canvas.toJSON();
  }

  exportUndoStack() {
    const undoStack = that.undoStack.slice(0); //? Fastest way to clone array
    that.undoStack = [];

    return undoStack;
  }

  exportRedoStack() {
    const redoStack = that.redoStack.slice(0);
    that.redoStack = [];

    return redoStack;
  }

  exportCanvasToImage() {
    // const transform = that.canvas.viewportTransform.slice(0);
    // that.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

    const data = that.canvas.toDataURL({
      format: "jpeg",
      multiplier: 2,
      quality: 0.8,
    });

    // that.canvas.viewportTransform = transform;
    that.canvas.renderAll();

    return data;
  }

  cleanUndoStack() {
    that.undoStack = [];
  }

  importJSON(json: string) {
    that.isRestore = true;
    that.canvas.loadFromJSON(json, () => {
      that.canvas.renderAll();
      that.zoom("fit");
      that.setAutoLayer();
      that.isRestore = false;
    });
  }

  setAutoLayer() {
    that.canvas.getObjects().forEach((obj) => {
      if (obj.type === "i-text") {
        that.canvas.bringToFront(obj);
      }

      if (obj.type === "image") {
        obj.set({
          selectable: false,
          evented: false,
        });
        that.canvas.sendToBack(obj);
      }
    });
  }

  clear() {
    that.canvas.clear();
  }
}

export default CanvasControl;

const that = new CanvasControl();
export const initDispatch = (state, dispatch) =>
  that.initSetState(state, dispatch);

export { that as canvasControl };
