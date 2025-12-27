import './about.css'
import {getVersion} from "../../values/version.js"
import logo from "../../image/logo.png"
export default function About(props){
        
        return(
                <div className='about'>
                        <div className='aboutContent'>
                                <img className='aboutLogo' src={logo} /><br />
                                <span className='aboutTitle'>Astra Lab</span><br />
                                <span className='version'>{getVersion()}</span><br />
                                <span className='authon'>
                                        By _KOSHINO_
                                </span><br />
                                <button className='aboutButton'
                                        onClick={props.closeAbout}
                                >确定</button>
                        </div>
                </div>
        )
}