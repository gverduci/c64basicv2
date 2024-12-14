import { useState, useEffect } from "react";
import "../../node_modules/@vscode/codicons/dist/codicon.css";
import "../../node_modules/@vscode/codicons/dist/codicon.ttf";
import { useRef } from "react";

const WIDTH = 16;
const HEIGHT = 16;
const colorMap: { [id: number]: string } = {
  0: "#352879",
  1: "#6C5EB5",
  2: "#9F4E44",
  3: "#6D5412",
};
const modes: string[] = ["DRAW", "ERASE", "MOVE"];

function useDrawCanvas(
  numberOfColumns: number,
  numberOfLines: number,
  extendedlines: Generator<[number[], number]>,
): any {
  const [lastClick, setLastClick] = useState<string>("");
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [mode, setMode] = useState<string>(modes[0]);
  const [statusCurrentAction, setStatusCurrentAction] = useState<{
    action: string,
    status: string,
    line: number;
    column: number;
    value: number;
  } | null>(null);
  
  useEffect(() => {
    /**
     *
     */
    const draw = () => {
      if (canvasContext) {
        const ctx: CanvasRenderingContext2D = canvasContext;
        ctx.fillStyle = "black";
        ctx.fillRect(
          0,
          0,
          WIDTH * numberOfColumns + 1,
          HEIGHT * numberOfLines + 1,
        );
        for (let [values, lineCount] of extendedlines) {
          values.forEach((value: number, i: number) => {
            let color = colorMap[value];
            ctx.fillStyle = color;
            ctx.fillRect(
              WIDTH * i + 1,
              HEIGHT * lineCount + 1,
              WIDTH - 1,
              HEIGHT - 1,
            );
          });
        }
      }
    };
    if (canvasContext) {
      draw();
    }
  }, [canvasContext, canvasHeight, canvasWidth, lastClick, extendedlines, numberOfColumns, numberOfLines]);

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext("2d"));
      setCanvasWidth(canvasRef.current.width);
      setCanvasHeight(canvasRef.current.height);
    }
  }, [canvasRef]);

  useEffect(() => {
    let isPainting = false;
    let isMoving = false;
    const moveArea = (event: any) => {
      if (!isMoving) {
        return;
      }
      const newLocation = { x: event.offsetX, y: event.offsetY };
      const line = Math.floor(newLocation.y / HEIGHT);
      const column = Math.floor(newLocation.x / WIDTH);
      setStatusCurrentAction({action:"MOVE", status: "on", line, column, value: 0 })
      setLastClick(new Date().toISOString());
    };
    const drawPixel = (event: any) => {
      if (!isPainting) {
        return;
      }
      const newLocation = { x: event.offsetX, y: event.offsetY };
      const line = Math.floor(newLocation.y / HEIGHT);
      const column = Math.floor(newLocation.x / WIDTH);
      const value = event.buttons === 5 || event.ctrlKey || mode === "ERASE" ? 0 : 1;
      setStatusCurrentAction({action:"DRAW", status: "on", line, column, value })
      setLastClick(new Date().toISOString());
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.buttons === 1 || event.buttons === 5) {
        if (mode === "MOVE") {
          isMoving = true;
        } else isPainting = true;
        drawPixel(event);
      }
    };

    const handleMouseUp = () => {
      if (isPainting){
        isPainting = false;
        setStatusCurrentAction({action:"DRAW", status: "off", line:0, column:0, value:0 })
      }
      if (isMoving){
        isMoving = false;
        setStatusCurrentAction({action:"MOVE", status: "off", line:0, column:0, value:0 })
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (isPainting){
        isPainting = false;
        setStatusCurrentAction({action:"DRAW", status: "off", line:0, column:0, value:0 })
      }
      if (isMoving){
        isMoving = false;
        setStatusCurrentAction({action:"MOVE", status: "off", line:0, column:0, value:0 })
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isPainting) drawPixel(event);
      if (isMoving) moveArea(event);
    };

    const element = canvasRef?.current;
    if (element) {
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("mouseup", handleMouseUp);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("mouseup", handleMouseUp);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, [canvasRef, mode]);

  return {
    canvasRef,
    update: () => setLastClick(new Date().toISOString()),
    pixelWidth: WIDTH,
    pixelHeight: HEIGHT,
    colorMap,
    statusCurrentAction,
    modes,
    mode,
    setMode,
  };
}

export default useDrawCanvas;
