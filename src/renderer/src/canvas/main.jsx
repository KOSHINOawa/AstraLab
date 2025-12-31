import { useRef, useEffect, useState } from "react";
import render from "./render.js";

import {
        addToRender,
        getRender,
        removeFromRender,
        isMouseTouchingAnything,
        getCanvasXY,
        setCanvasX,
        setCanvasY,
        mouseTouchObject,
        setSelectObject,
        changeCanvasSizeBy,
        returnCanvasSize
} from "../values/ctx_content.js";

import loadDefault from "../values/ctx_default.jsx";
import { getSetting } from "../values/settings.jsx";
import { returnFix } from "../components/properties/fix.js";

import Tab from "../components/tab/tab.jsx";
import About from "../components/about/about.jsx";
import Settings from "../components/settings/settings.jsx";
import Properties from "../components/properties/properties.jsx";

export default function Canvas() {

        const [isTouchingAnyObject, setTouchingAnyObject] = useState(false);
        const [isShowAbout, setShowAbout] = useState(false);
        const [isShowSettings, setShowSettings] = useState(false);
        const [isOpeningUI, setOpenUI] = useState(false);
        const [isOpeningProp, setOpenProp] = useState(false);
        const canvasRef = useRef(null);
        const MousePos = useRef({ x: 0, y: 0 });
        const CanvasOffset = useRef({
                x: getCanvasXY().x,
                y: getCanvasXY().y
        });

        const isMouseDown = useRef(false);
        const isOpeningUIRef = useRef(false);
        const isOpeningPropRef = useRef(false);

        function updateCanvas() {
                render(canvasRef.current, getRender());
        }


        useEffect(() => {
                isOpeningUIRef.current = isOpeningUI;
        }, [isOpeningUI]);
        useEffect(() => {
                isOpeningPropRef.current = isOpeningProp;
        },[isOpeningProp])

        useEffect(() => {
                loadDefault();
                updateCanvas();
        }, []);

        function dragCanvas() {
                if (isMouseTouchingAnything(MousePos.current.x, MousePos.current.y)) return;

                const x = CanvasOffset.current.x + MousePos.current.x;
                const y = CanvasOffset.current.y + MousePos.current.y;

                setCanvasX(x);
                setCanvasY(y);
        }

        function onMouseMove(e) {
                MousePos.current.x = e.clientX;
                MousePos.current.y = e.clientY;

                const touching = isMouseTouchingAnything(
                        MousePos.current.x,
                        MousePos.current.y
                );

                setTouchingAnyObject(touching);
                canvasRef.current.style.cursor = touching ? "pointer" : "move";

                if (isMouseDown.current && !isOpeningUIRef.current) {
                        dragCanvas();
                }

                updateCanvas();
        }

        function onMouseDown() {
                if (isOpeningUIRef.current) return;
                if (isOpeningPropRef.current){
                        if (!(MousePos.current.x < window.innerWidth - 400)) return
                }

                isMouseDown.current = true;

                if (!isMouseTouchingAnything(MousePos.current.x, MousePos.current.y)) {
                        CanvasOffset.current.x = getCanvasXY().x - MousePos.current.x;
                        CanvasOffset.current.y = getCanvasXY().y - MousePos.current.y;

                        removeFromRender("选中框");
                        setSelectObject({});
                } else if (!returnFix()) {
                        const obj = mouseTouchObject(MousePos.current.x, MousePos.current.y);
                        setSelectObject(obj);
                        removeFromRender("选中框");

                        addToRender({
                                id: "选中框",
                                command: "stroke",
                                x: (obj.command === "fill" ? obj.x[0] : obj.x) - 2,
                                y:
                                        (obj.command === "text"
                                                ? obj.y - 50
                                                : obj.command === "fill"
                                                        ? obj.y[0]
                                                        : obj.y) - 2,
                                width:
                                        (obj.command === "text"
                                                ? obj.pxlong
                                                : obj.command === "fill"
                                                        ? obj.x[1] - obj.x[0]
                                                        : obj.width) + 4,
                                height:
                                        (obj.command === "text"
                                                ? 50
                                                : obj.command === "fill"
                                                        ? obj.y[1] - obj.y[0]
                                                        : obj.height) + 4,
                                color: "#33ccff"
                        });
                }

                updateCanvas();
        }

        function onMouseUp() {
                isMouseDown.current = false;
        }

        function onWheel(e) {
                if (isOpeningUIRef.current) return;

                const delta = e.deltaY * getSetting("canvas_oncechange_size");

                changeCanvasSizeBy(
                        delta < 0
                                ? returnCanvasSize() > 0.9 ? delta : 0
                                : returnCanvasSize() < 4 ? delta : 0
                );

                updateCanvas();
        }

        useEffect(() => {
                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mousedown", onMouseDown);
                window.addEventListener("mouseup", onMouseUp);
                window.addEventListener("wheel", onWheel);

                return () => {
                        window.removeEventListener("mousemove", onMouseMove);
                        window.removeEventListener("mousedown", onMouseDown);
                        window.removeEventListener("mouseup", onMouseUp);
                        window.removeEventListener("wheel", onWheel);
                };
        }, []);


        return (
                <>
                        <Tab
                                touching={isTouchingAnyObject}
                                onUpdateCanvas={updateCanvas}
                                showAbout={() => setShowAbout(true)}
                                showSettings={() => setShowSettings(true)}
                                enableUI={() => setOpenUI(true)}
                        />

                        {isShowAbout && (
                                <About
                                        closeAbout={() => setShowAbout(false)}
                                        unableUI={() => setOpenUI(false)}
                                />
                        )}

                        {isShowSettings && (
                                <Settings
                                        closeSettings={() => setShowSettings(false)}
                                        update={updateCanvas}
                                        unableUI={() => setOpenUI(false)}
                                />
                        )}

                        <Properties
                                NowMouseX={() => MousePos.current.x}
                                NowMouseY={() => MousePos.current.y}
                                isEnableProp={() => isOpeningUI}
                                enableProp={() => setOpenProp(true)}
                                unableProp={() => setOpenProp(false)}
                                onUpdateCanvas={updateCanvas}
                        />

                        <canvas
                                ref={canvasRef}
                                className="main"
                                width={window.innerWidth}
                                height={window.innerHeight}
                                style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        zIndex: -1
                                }}
                        />
                </>
        );
}
