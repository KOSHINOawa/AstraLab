import { useRef, useEffect, useState } from "react";
import render, { getCtx } from './render.js'
import '../values/ctx_content.js'
import { addToRender, getRender, removeFromRender, isMouseTouchingAnything, getCanvasXY, setCanvasX, setCanvasY, mouseTouchObject, setSelectObject, changeCanvasSizeBy, returnCanvasSize } from "../values/ctx_content.js";
import loadDefault from "../values/ctx_default.jsx";

import Tab from '../components/tab/tab.jsx'
import About from '../components/about/about.jsx'
import Settings from '../components/settings/settings.jsx'
import Properties from '../components/properties/properties.jsx'
import '../components/properties/fix.js'

import { getSetting } from "../values/settings.jsx";
import { returnFix } from "../components/properties/fix.js";

export default function Canvas() {

        const [isTouchingAnyObject, setTouchingAnyObject] = useState(false);
        const canvasRef = useRef(null);
        const MouseX = useRef(0);
        const MouseY = useRef(0);
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
                                MouseX.current,
                                MouseY.current
                        ))
                        //直接用isTouchingAnyObject有问题，非常奇怪
                        if (!isMouseTouchingAnything(
                                MouseX.current,
                                MouseY.current
                        ) == false) {
                                canvasRef.current.style.cursor = "pointer"
                        } else {
                                canvasRef.current.style.cursor = "move"
                        }

                }
                canvasRef.current.addEventListener('mousemove', canvasEnter)
                window.addEventListener('resize', handleResize);
                window.addEventListener('mousemove', (event) => {
                        MouseX.current = event.clientX;
                        MouseY.current = event.clientY;
                        updateCanvas()
                }, 20);

                window.addEventListener('resize', (event) => {
                        updateCanvas()
                });
                function moveCanvas() {
                        if (isMouseTouchingAnything(MouseX.current, MouseY.current) == false) {
                                const changeX = (o_CanvasX + MouseX.current);
                                const changeY = (o_CanvasY + MouseY.current)
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
                        if (isOpeningUIRef.current == false) {
                                if (isMouseTouchingAnything(MouseX.current, MouseY.current) == false) {
                                        o_CanvasX = getCanvasXY()['x'] - MouseX.current
                                        o_CanvasY = getCanvasXY()['y'] - MouseY.current
                                        window.addEventListener('mousemove', moveCanvas);
                                        window.addEventListener('mouseup', move_checkMouseUp);
                                        removeFromRender("选中框");
                                        setSelectObject({});
                                        updateCanvas()
                                } else if (!returnFix()) { //碰到了啥
                                        const touchObject = mouseTouchObject(MouseX.current, MouseY.current);
                                        console.log(touchObject)
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
                                                        "color": "#33ccff"
                                                }
                                        )
                                        updateCanvas()
                                }
                        }
                }
                function canvasSize(e) {
                        if (!isOpeningUIRef.current) {
                                changeCanvasSizeBy(
                                        e.deltaY * getSetting("canvas_oncechange_size") < 0 ?
                                                returnCanvasSize() > 0.9 ?
                                                        e.deltaY * getSetting("canvas_oncechange_size") : 0
                                                : returnCanvasSize() < 4 ?
                                                        e.deltaY * getSetting("canvas_oncechange_size") : 0

                                ) //百分数

                                updateCanvas()
                        }
                }
                window.addEventListener('mousedown', move_checkMouseDown)
                window.addEventListener('wheel', (e) => canvasSize(e))
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
                        <Properties
                                NowMouseX={() => { return MouseX.current }}
                                NowMouseY={() => { return MouseY.current }}
                                enableUI={() => { setOpenUI(true) }}
                                unableUI={() => { setOpenUI(false) }}
                                onUpdateCanvas={() => { updateCanvas() }}
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