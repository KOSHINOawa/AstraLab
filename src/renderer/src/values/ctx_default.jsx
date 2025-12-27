import Logo from "../image/logo.png"
import {removeFromRender, addToRender} from '../values/ctx_content.js'

export default function loadDefault(){
        removeFromRender('Test');
        


        const img = new Image();
        img.src = Logo;
        img.onload = () => {
                addToRender(
                        {
                                "id": "Test",
                                "command": "image",
                                "image": img,
                                "x": 0,
                                "y": 0,
                                "width": 100,
                                "height": 100
                        }
                )
        }
}