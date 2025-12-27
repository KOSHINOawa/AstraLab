import { useRef, useEffect, useState } from "react";
import render, { getCtx } from './render.js'
import '../values/ctx_content.js'
import { addToRender, getRender, removeFromRender,isMouseTouchingAnything} from "../values/ctx_content.js";
import loadDefault from "../values/ctx_default.jsx";
import Tab from '../components/tab/tab.jsx'
import About from '../components/about/about.jsx'

export default function Canvas() {

        const canvasRef = useRef(null);
        let MouseX = 0;
        let MouseY = 0;
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
                        if (isMouseTouchingAnything(
                                MouseX, 
                                MouseY,
                        )){
                                canvasRef.current.style.cursor = "pointer"
                        } else {
                                canvasRef.current.style.cursor = "default"
                        }
                        
                }
                canvasRef.current.addEventListener('mousemove',canvasEnter)
                window.addEventListener('resize', handleResize);
                window.addEventListener('mousemove', (event) => {
                        MouseX = event.clientX;
                        MouseY = event.clientY;
                        updateCanvas()
                });
                window.addEventListener('resize', (event) => {
                        updateCanvas()
                });

                return () => {
                        window.removeEventListener('resize', handleResize);
                };
        }, []);
        const [isShowAbout, changAboutDisplay] = useState(false)
        return (
                <>
                        <Tab
                                onUpdateCanvas={updateCanvas}
                                showAbout={() => { changAboutDisplay(true) }}
                        />
                        {isShowAbout ? <About
                                closeAbout={() => { changAboutDisplay(false) }}
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