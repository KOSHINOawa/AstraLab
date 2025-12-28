import { useRef, useEffect, useState } from "react";
import render, { getCtx } from './render.js'
import '../values/ctx_content.js'
import { addToRender, getRender, removeFromRender, isMouseTouchingAnything, getCanvasXY, setCanvasX, setCanvasY} from "../values/ctx_content.js";
import loadDefault from "../values/ctx_default.jsx";

import Tab from '../components/tab/tab.jsx'
import About from '../components/about/about.jsx'
import Settings from '../components/settings/settings.jsx'

export default function Canvas() {
        const [isTouchingAnyObject, setTouchingAnyObject] = useState(false);
        const canvasRef = useRef(null);
        let MouseX = 0;
        let MouseY = 0;
        let o_CanvasX = getCanvasXY()['x'] + MouseX
        let o_CanvasY = getCanvasXY()['y'] + MouseY

        function updateCanvas() {
                render(canvasRef.current, getRender());
        }
        const [windowSize, setWindowSize] = useState({
                width: window.innerWidth,
                height: window.innerHeight
        });
        useEffect(() => {
                loadDefault();
        }, []);

        useEffect(() => {
                const handleResize = () => {
                        setWindowSize({
                                width: window.innerWidth,
                                height: window.innerHeight
                        });
                };
                const canvasEnter = () => {
                        setTouchingAnyObject(isMouseTouchingAnything(
                                MouseX,
                                MouseY
                        ))
                        //直接用isTouchingAnyObject有问题，非常奇怪
                        if (!isMouseTouchingAnything(
                                MouseX,
                                MouseY
                        ) == false) {
                                canvasRef.current.style.cursor = "pointer"
                        } else {
                                canvasRef.current.style.cursor = "move"
                        }

                }
                canvasRef.current.addEventListener('mousemove', canvasEnter)
                window.addEventListener('resize', handleResize);
                window.addEventListener('mousemove', (event) => {
                        MouseX = event.clientX;
                        MouseY = event.clientY;
                        updateCanvas()
                });

                window.addEventListener('resize', (event) => {
                        updateCanvas()
                });
                function moveCanvas() {
                        if (isMouseTouchingAnything(MouseX, MouseY) == false) {
                                const changeX = o_CanvasX + MouseX;
                                const changeY = o_CanvasY + MouseY
                                setCanvasX(changeX);
                                setCanvasY(changeY);
                                updateCanvas()
                        } else {
                                window.removeEventListener('mousedown',moveCanvas)
                                return;
                        }

                }
                window.addEventListener('mousedown', (event) => {
                        if (isMouseTouchingAnything(MouseX, MouseY) == false){
                                o_CanvasX = getCanvasXY()['x'] - MouseX
                                o_CanvasY = getCanvasXY()['y'] - MouseY
                                window.addEventListener('mousemove', moveCanvas);
                                window.addEventListener('mouseup', (event) => {
                                        window.removeEventListener('mousemove', moveCanvas);
                                        window.removeEventListener('mouseup', event);
                                        window.removeEventListener('mousedown', event);
                                })
                        } else {
                                window.removeEventListener('mousedown', event);
                        }
                })

                return () => {
                        window.removeEventListener('resize', handleResize);
                };
        }, []);
        const [isShowAbout, changeAboutDisplay] = useState(false)
        const [isShowSettings, changeSettingsDisplay] = useState(false)
        return (
                <>
                        <Tab
                                onUpdateCanvas={updateCanvas}
                                showAbout={() => { changeAboutDisplay(true) }}
                                showSettings={() => { changeSettingsDisplay(true) }}
                                touching={
                                        isTouchingAnyObject
                                }
                        />
                        {isShowAbout ? <About
                                closeAbout={() => { changeAboutDisplay(false) }}
                        /> : null}
                        {isShowSettings ? <Settings
                                closeSettings={() => { changeSettingsDisplay(false) }}
                                update={updateCanvas}
                        /> : null}

                        <canvas className="main" ref={canvasRef} width={windowSize.width} height={windowSize.height} style={{
                                position: "absolute",
                                margin: 0,
                                top: 0,
                                left: 0,
                                zIndex: -1
                        }}
                        /></>
        );
}