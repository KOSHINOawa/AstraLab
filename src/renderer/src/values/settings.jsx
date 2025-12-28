
if(localStorage.getItem("Settings") == undefined){
        var settings = {
                "enable_highLight_box":false
        }
        localStorage.setItem("Settings", JSON.stringify(settings));
} else {
        var settings = JSON.parse(localStorage.getItem("Settings"));
}


export function getSetting(id){
        return settings[id]
}

export function setSettingValue(id, value){
        if(value == undefined) return
        settings[id] = value;
        localStorage.setItem("Settings", JSON.stringify(settings));
}