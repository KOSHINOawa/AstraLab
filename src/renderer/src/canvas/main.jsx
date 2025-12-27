import { useRef, useEffect, useState } from "react";
import render from './render.js'
import '../values/ctx_content.js'
import { addToRender, getRender, removeFromRender } from "../values/ctx_content.js";
import loadDefault from "../values/ctx_default.jsx";
import Tab from '../components/tab/tab.jsx'


export default function Canvas() {
        

        const [windowSize, setWindowSize] = useState({
                width: window.innerWidth,
                height: window.innerHeight
        });
        useEffect(() => {
                loadDefault();
        },[]);

        useEffect(() => {
                updateCanvas()
                const handleResize = () => {
                        setWindowSize({
                                width: window.innerWidth,
                                height: window.innerHeight
                        });
                        
                };

                window.addEventListener('resize', handleResize);
                

                return () => {
                        window.removeEventListener('resize', handleResize);
                };
        }, []);

        const canvasRef = useRef(null);

        function updateCanvas(){
                render(canvasRef.current, getRender());
        }
        return (
                <>
                        <Tab 
                                onUpdateCanvas={updateCanvas} 
                        />
                        
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