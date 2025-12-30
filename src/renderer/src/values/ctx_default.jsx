import Logo from "../image/logo.png"
import { removeFromRender, addToRender } from '../values/ctx_content.js'

export default function loadDefault() {
        
        removeFromRender('矩形碰撞测试');
        removeFromRender('文字碰撞测试');



        const img = new Image();
        img.src = Logo;
        img.onload = () => {
                removeFromRender('图片碰撞测试');
                addToRender(
                        {
                                "id": "图片碰撞测试",
                                "command": "image",
                                "image": img,
                                "x": 0,
                                "y": 0,
                                "width": 100,
                                "height": 100
                        }
                )
        }
        addToRender(
                {
                        "id": "矩形碰撞测试",
                        "command": "fill",
                        "x": [0, 100],
                        "y": [100, 200],
                        "color": "#ffffff"
                }
        )
        addToRender(
                {
                        "id": "文字碰撞测试",
                        "command": "text",
                        "x": 0,
                        "y": 300,
                        "color": "#ffffff",
                        "text": "你好世界 Hello World 1234567890 !@#$%^ ！？，。"
                }
        )
        console.log(1)
}