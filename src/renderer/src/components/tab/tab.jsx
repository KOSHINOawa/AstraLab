import { useState } from 'react'
import './tab.css'
import '../../values/ctx_content'
import { addToRender } from '../../values/ctx_content';

export default function Tab(props) {
        
        const [nowy, changey] = useState(100);
        function addTest() {
                changey(nowy+100);
                addToRender(
                        {
                                'id':'TEST',
                                'command':'text',
                                'text':"Hello World",
                                'x':0,
                                'y':nowy

                        }
                )
                props.onUpdateCanvas();

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