import { useEffect, useState } from 'react'
import './tab.css'
import '../../values/ctx_content'
import { addToRender, removeFromRender } from '../../values/ctx_content';

export default function Tab(props) {
        let nowX = 0;
        let nowY = 0;
        let MouseDown = false;
        let Name = Date.now()
        function mouseDown(event) {
                if (event.button == 0) {
                        MouseDown = true
                }
        }
        function mouseUp(event) {
                if (event.button == 0) {
                        removeEventListener("mousedown", mouseDown)
                        removeEventListener("mouseup", mouseUp)
                        removeEventListener("mousemove", mouseMove);
                }
        }
        function mouseMove(event) {
                console.log(Name)
                removeFromRender(Name);
                nowX = event.clientX;
                nowY = event.clientY;
                addToRender(
                        {
                                'id': Name,
                                'command': 'text',
                                'text': nowX.toString() + ',' + nowY.toString(),
                                'x': nowX,
                                'y': nowY

                        }
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
        return (
                <div className='tab'>
                        <button
                                className='addTest'
                                title='add Test'
                                onClick={addTest}
                        >添加测试</button>
                </div>
        )
}