import { useEffect, useState } from 'react'
import './tab.css'
import '../../values/ctx_content'
import { addToRender, getRender, removeFromRender, replaceRender, setRenderTo } from '../../values/ctx_content';
import logo from '../../image/logo.png'
import settings from './settings.svg'

export default function Tab(props) {

        let data = {};
        let nowX = 0;
        let nowY = 0;
        let MouseDown = false;
        let Name = Date.now();
        let addContent = {};
        let output = {};


        function mouseDown(event) {
                if (event.button == 0) {
                        MouseDown = true
                }
        }
        function mouseUp(event) {
                if (event.button == 0) {
                        console.log("Done")
                        removeEventListener("mousedown", mouseDown)
                        removeEventListener("mouseup", mouseUp)
                        removeEventListener("mousemove", mouseMove);

                }
        }
        function mouseMove(event) {

                removeFromRender(Name);
                nowX = event.clientX;
                nowY = event.clientY;
                output = JSON.parse(JSON.stringify(addContent));
                //气死我了为什么直接xx=yy是引用啊
                output['id'] = Name;
                output['x'] = nowX;
                output['y'] = nowY;

                if (addContent.hasOwnProperty('text')) {
                        output['text'] = addContent['text'];
                        data = {
                                "nowX": nowX,
                                "nowY": nowY
                        };

                        output['text'] = output['text'].replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
                        //寻找键值并替换
                }
                addToRender(
                        output
                )

                props.onUpdateCanvas();

        }

        function addTest() {
                Name = Date.now()
                MouseDown = false
                addEventListener("mousedown", mouseDown)
                addEventListener("mouseup", mouseUp)
                addEventListener("mousemove", mouseMove);

        }


        /*以下是关于加入的命令*/

        function addPos() {

                addContent = {
                        'command': 'text',
                        'text': '{nowX},{nowY}',
                };
                addTest()
        }
        const [isInputingText, changeInputingText] = useState(false);
        const [InputedText, changeInputedText] = useState("");
        function InputingText() {
                if (isInputingText) {
                        changeInputingText(false)
                } else {
                        changeInputingText(true)
                }
        }
        function addText() {
                addContent = {
                        'command': 'text',
                        'text': InputedText,
                };
                addTest()
                InputingText()
        }
        return (
                <div className='tab-tab'>
                        <img src={logo} className='tab-logo' onClick={props.showAbout} />
                        <button
                                className='tab-addTest'
                                title='add Test'
                                onClick={addPos}
                        >添加当前的坐标</button>
                        {!isInputingText ?
                                <button
                                        className='tab-addTest'
                                        title='add Test'
                                        onClick={InputingText}
                                >添加自定义文字</button>
                                :
                                <>
                                        <input
                                                className='tab-Tabinput'
                                                value={InputedText}
                                                onChange={e => changeInputedText(e.target.value)}
                                        />
                                        <button
                                                className='tab-addTest'
                                                title='add Test'
                                                onClick={addText}
                                        >添加</button>
                                </>

                        }
                        <span>碰到:{!props.touching == false ? props.touching : "棍母"}</span>
                        <div className='tab-tool'>
                                <button className='tab-settings-button'
                                        onClick={props.showSettings}>
                                        <img
                                                src={settings}
                                                width='20px'
                                                
                                        />
                                </button>

                        </div>
                </div>
        )
}