import AlcoholLamp from '../image/al.png'
import Logo from '../image/logo.png'
import fireEffect from "../image/fireEffect.svg"


import { preloadImages } from '../values/imageLoader'

export default function loadImg() {
        return preloadImages([
                { id: "fireEffect", src: fireEffect },
                { id: "logo", src: Logo },
                { id: "alcoholLamp", src: AlcoholLamp }
        ])
}