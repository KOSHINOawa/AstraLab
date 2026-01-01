import { useEffect, useRef, useState } from 'react'
import './tab.css'
import {
        addToRender,
        removeFromRender,
        getCanvasXY,
        returnSelectObject
} from '../../values/ctx_content'

import logo from '../../image/logo.png'
import settings from './settings.svg'

export default function Tab(props) {

        const isAddingRef = useRef(false)
        const nameRef = useRef(0)
        const addContentRef = useRef(null)


        const [mouseX, setMouseX] = useState(0)
        const [mouseY, setMouseY] = useState(0)
        const [isInputingText, setIsInputingText] = useState(false)
        const [inputText, setInputText] = useState('')


        useEffect(() => {
                const onMove = (e) => {
                        setMouseX(getCanvasXY().x + e.clientX)
                        setMouseY(getCanvasXY().y + e.clientY)
                }
                window.addEventListener('mousemove', onMove)
                return () => window.removeEventListener('mousemove', onMove)
        }, [])


        const startAdd = (content) => {
                nameRef.current = Date.now()
                addContentRef.current = content
                isAddingRef.current = true
        }

        const handleMouseMove = (e) => {
                if (!isAddingRef.current) return

                removeFromRender(nameRef.current)

                const x = e.clientX - getCanvasXY().x
                const y = e.clientY - getCanvasXY().y

                const output = {
                        ...addContentRef.current,
                        id: nameRef.current,
                        x,
                        y,
                        
                }

                if (output.text) {
                        output.text = output.text.replace(/\{(\w+)\}/g, (_, k) =>
                                ({ nowX: x, nowY: y }[k] ?? `{${k}}`)
                        )
                }

                addToRender(output)
                props.onUpdateCanvas()
        }

        const stopAdd = () => {
                isAddingRef.current = false
                addContentRef.current = null
        }

        useEffect(() => {
                window.addEventListener('mousemove', handleMouseMove)
                window.addEventListener('mouseup', stopAdd)
                return () => {
                        window.removeEventListener('mousemove', handleMouseMove)
                        window.removeEventListener('mouseup', stopAdd)
                }
        }, [])


        const addPosText = () => {
                startAdd({
                        command: 'text',
                        text: '{nowX},{nowY}'
                })
        }

        const addCustomText = () => {
                startAdd({
                        command: 'text',
                        text: inputText
                })
                setIsInputingText(false)
                setInputText('')
        }

        return (
                <div className="tab-tab">
                        <img
                                src={logo}
                                className="tab-logo"
                                onMouseDown={e => e.stopPropagation()}
                                onClick={() => {
                                        props.enableUI()
                                        props.showAbout()
                                }}
                        />

                        <button className="tab-addTest" onClick={addPosText}>
                                添加鼠标坐标
                        </button>

                        {!isInputingText ? (
                                <button
                                        className="tab-addTest"
                                        onClick={() => setIsInputingText(true)}
                                >
                                        添加注解
                                </button>
                        ) : (
                                <>
                                        <input
                                                className="tab-Tabinput"
                                                value={inputText}
                                                onChange={e => setInputText(e.target.value)}
                                        />
                                        <button className="tab-addTest" onClick={addCustomText}>
                                                添加
                                        </button>
                                </>
                        )}

                        <div className="tab-info">
                                鼠标坐标：{mouseX},{mouseY}，
                                选中对象：{returnSelectObject()?.id ?? '无'}
                        </div>

                        <div className="tab-tool">
                                <button
                                        className="tab-settings-button"
                                        onClick={() => {
                                                props.enableUI()
                                                props.showSettings()
                                        }}
                                >
                                        <img src={settings} width="20" />
                                </button>
                        </div>
                </div>
        )
}
