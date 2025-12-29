import './settings.css'
import { getSetting, setSettingValue } from '../../values/settings'
import { useState } from 'react'

export default function Settings(props) {
        const [enableHighLightBox, setEnableHighLightBox] = useState(
                getSetting("enable_highLight_box")
        )

        function handleToggleHighLightBox(e) {
                const newValue = e.target.checked;
                setEnableHighLightBox(newValue);
                setSettingValue("enable_highLight_box", newValue);
                props.update()
        }
        const {unableUI} = props;

        return (
                <div className='settings'>
                        <button
                                className='settings-Button'
                                onClick={() => {
                                        props.closeSettings();
                                        unableUI()
                                }}
                        >关闭</button>
                        <span className='settings-Title'>设置</span>

                        <div className='settings-content'>
                                <h2 className='settings-content-title'>开发者设置</h2>
                                <div className='settings-content-tag'>
                                        <div>
                                                <span className='settings-content-intro'>
                                                        启用碰撞箱检测
                                                </span>
                                                <br />
                                                <span className='settings-content-intro-min'>
                                                        启用后，画布上会用高亮显示碰撞箱
                                                </span>
                                        </div>
                                        <div>
                                                <input
                                                        type='checkbox'
                                                        className='switch'
                                                        checked={enableHighLightBox}
                                                        onChange={handleToggleHighLightBox}
                                                />
                                        </div>
                                </div>
                        </div>
                </div>
        )
}