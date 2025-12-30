import { useState, useEffect } from 'react';
import '../../values/ctx_content'
import './properties.css'
import fix from './fix.svg'
import { setFixTo } from './fix.js';
import { returnSelectObject, replaceRender, whereIsObject, removeFromRender, addToRender, getRender } from '../../values/ctx_content';

export default function Properties(props) {
        const [rightPosition, setRightPosition] = useState(-400); // 默认隐藏（右侧400px）
        const [fixProp, setFixProp] = useState(false);
        const [selectObjectProp, setSelectObjectProp] = useState(
                returnSelectObject()
        );
        function changeObjectText(e) {
                const newText = e.target.value;
                const nowJSON = returnSelectObject();
                nowJSON['text'] = newText;
                delete nowJSON.textlong;
                console.log(nowJSON)
                replaceRender(whereIsObject(returnSelectObject()['id']), nowJSON)
                removeFromRender("选中框")
                props.onUpdateCanvas()

        }
        useEffect(() => {
                function checkSelect() {
                        const checkValue = returnSelectObject()['id'] == undefined ? -400 : 0
                        if (returnSelectObject()['canChange'] != false && !fixProp) {
                                props.enableUI()
                                if (props.NowMouseX() < window.innerWidth - 400 || rightPosition == -400) {
                                        props.unableUI()
                                        setRightPosition(checkValue);
                                        setSelectObjectProp(returnSelectObject())
                                }


                        }
                };

                window.addEventListener('mousemove', checkSelect);
                window.addEventListener('mousedown', checkSelect);


                return () => {
                        window.removeEventListener('mousemove', checkSelect);
                        window.removeEventListener('mousedown', checkSelect);
                };
        }, [props, rightPosition]);

        return (
                <div className='properties_bg' style={{
                        right: rightPosition.toString() + 'px',
                }}>
                        <div className='content_title'>
                                <button className='fix' onClick={() => { setFixTo(!fixProp); setFixProp(!fixProp); }}>
                                        <img src={fix} style={{
                                                "width": '20px',
                                                "transition": "transform 0.2s ease",
                                                "transform": 'rotate(' + (fixProp ? -45 : 0).toString() + 'deg)'
                                        }} />
                                </button>
                                <span>修改属性:{selectObjectProp['id']}</span>

                        </div>
                        {selectObjectProp['command'] == "text" &&
                                <div className='content_block'>
                                        <span>内容：</span>
                                        <input
                                                defaultValue={selectObjectProp['text']}
                                                onChange={changeObjectText}
                                                className='content_input'
                                        />
                                </div>
                        }

                </div>
        );
}