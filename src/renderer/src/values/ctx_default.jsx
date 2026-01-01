import { removeFromRender, addToRender, getRender } from '../values/ctx_content.js'
import { getImage } from '../values/imageLoader'


export default function loadDefault() {

        removeFromRender('矩形碰撞测试');
        removeFromRender('文字碰撞测试');
        removeFromRender('小文字碰撞测试');
        removeFromRender('酒精灯');
        addToRender(
                {
                        "id": "酒精灯",
                        "thing": "酒精灯",
                        "command": "image",
                        "image": getImage('alcoholLamp'),
                        "x": 0,
                        "y": 350,
                        "height": 200,
                        "width": 200,
                        "effect": {
                                "fire": 0
                        }
                }
        )


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
                        "size": 50,
                        "color": "#ffffff",
                        "text": "你好世界 Hello World 1234567890 !@#$%^ ！？，。"
                }
        )
}