const content = [];
/*
格式
{
        "id":...,
        "command":...,
        ---
}
*/
const listeners = new Set(); //监听器

export function getRender(){
        return content
}

export function setRenderTo(data){
        content = data;
}

// 添加到渲染队列
export function addToRender(data) {
        content.push(data);
        notifyListeners(); 
}

export function replaceRender(where,data){
        content[where] = data
}
export function removeFromRender(id) {

        for(var i=0;i<content.length;i++){
                if(content[i]["id"] == id){
                        content.splice(i,1)
                }
        }
        notifyListeners();
}

export function clearRender() {
        content = [];
        notifyListeners();
}

export function isMouseTouchingAnything(x,y){
        for (var i = 0; i < content.length; i++) {
                switch(content[i]['command']){
                        case 'fill':
                                if (
                                        content[i]['x'][0] < x && 
                                        content[i]['y'][0] < y &&
                                        content[i]['x'][1] - content[i]['x'][0] > x &&
                                        content[i]['y'][1] - content[i]['y'][0] > y
                                ) return true;
                                break
                        case 'image':
                                if(
                                        content[i]['x'] < x &&
                                        content[i]['y'] < y &&
                                        content[i]['x'] + content[i]['width'] > x &&
                                        content[i]['y'] + content[i]['height'] > y
                                ) return true;
                                break
                        case 'text':
                                if(
                                        content[i]['x'] < x &&
                                        content[i]['y'] - 50 < y &&
                                        content[i]['x'] + content[i]['pxlong'] > x &&
                                        content[i]['y'] > y

                                ) return true;
                                break
                }
                
        }
        return false
}

function notifyListeners() {
        listeners.forEach(callback => callback(content));
}

