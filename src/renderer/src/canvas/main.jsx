import { useRef, useEffect, useState } from "react";
import render, { getCtx } from './render.js'
import '../values/ctx_content.js'
import { addToRender, getRender, removeFromRender, isMouseTouchingAnything, getCanvasXY, setCanvasX, setCanvasY, mouseTouchObject, setSelectObject } from "../values/ctx_content.js";
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
                updateCanvas()
        }, []);
        const [isShowAbout, changeAboutDisplay] = useState(false)
        const [isShowSettings, changeSettingsDisplay] = useState(false)
        const [isOpeningUI, setOpenUI] = useState(false)
        const isOpeningUIRef = useRef(isOpeningUI);
        useEffect(() => {
                isOpeningUIRef.current = isOpeningUI;
        }, [isOpeningUI]);
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
                }, 20);

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
                                window.removeEventListener('mousedown', moveCanvas)
                                return;
                        }

                }
                function move_checkMouseUp() {
                        window.removeEventListener('mousemove', moveCanvas);
                        window.removeEventListener('mouseup', move_checkMouseUp);
                }
                function move_checkMouseDown() {
                        if (!isOpeningUIRef.current) {
                                if (isMouseTouchingAnything(MouseX, MouseY) == false) {
                                        o_CanvasX = getCanvasXY()['x'] - MouseX
                                        o_CanvasY = getCanvasXY()['y'] - MouseY
                                        window.addEventListener('mousemove', moveCanvas);
                                        window.addEventListener('mouseup', move_checkMouseUp)
                                } else { //碰到了啥
                                        const touchObject = mouseTouchObject(MouseX, MouseY);
                                        setSelectObject(touchObject);
                                        //上传到ctx_content作为api读取↑
                                        removeFromRender("选中框")
                                        /*
                                        ↑的“mouseTouchObject”函数是获取全部属性的，而isMouseTouchingAnything是获取它的id
                                        详细请参考ctx_content.js
                                        这里挺乱的，大致说一下：
                                        对于填充（fill）因为它的值没width与height所以需要用它提供的x与y进行计算，
                                        具体可以看render.js查询，我是照着做的。
                                        文字的对齐是鼠标右上，这个“-50”是因为我设置的属性是50px的高
                                        hmm，如果做可变高也可以？就是有点麻烦，要改挺多部分的
                                        */
                                        addToRender(
                                                {
                                                        "id": "选中框",
                                                        "command": "stroke",
                                                        "x": (touchObject["command"] == 'fill' ?
                                                                touchObject['x'][0] : touchObject["x"]) - 2,
                                                        "y":
                                                                (touchObject['command'] == "text" ?
                                                                        touchObject['y'] - 50 : touchObject["command"] == 'fill' ?
                                                                                touchObject['y'][0] : touchObject['y']) - 2, //文字的对齐不一样

                                                        "width": (touchObject['command'] == "text" ?
                                                                touchObject["pxlong"] : touchObject['command'] == "fill" ?
                                                                        touchObject['x'][1] - touchObject['x'][0] : touchObject["width"]) + 4,

                                                        "height": (touchObject['command'] == "text" ?
                                                                50 : touchObject['command'] == "fill" ?
                                                                        touchObject['y'][1] - touchObject['y'][0] : touchObject['height']) + 4
                                                        ,
                                                        "color": "#ff0000"
                                                }
                                        )
                                        updateCanvas()
                                }
                        }
                }

                window.addEventListener('mousedown', move_checkMouseDown)

                return () => {
                        window.removeEventListener('resize', handleResize);
                };
        }, []);

        return (
                <>
                        <Tab
                                onUpdateCanvas={() => { updateCanvas() }}
                                showAbout={() => { changeAboutDisplay(true) }}
                                showSettings={() => { changeSettingsDisplay(true) }}
                                touching={() =>
                                        isTouchingAnyObject
                                }
                                enableUI={() => { setOpenUI(true) }}
                                unableUI={() => { setOpenUI(false) }}
                        />
                        {isShowAbout ? <About
                                closeAbout={() => { changeAboutDisplay(false) }}
                                unableUI={() => { setOpenUI(false) }}
                        /> : null}
                        {isShowSettings ? <Settings
                                closeSettings={() => { changeSettingsDisplay(false) }}
                                update={() => updateCanvas()}
                                unableUI={() => { setOpenUI(false) }}
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