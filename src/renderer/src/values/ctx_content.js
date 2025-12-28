const content = [];
const xy = {"x":30,"y":100};
/*
格式
{
        "id":...,
        "command":...,
        ---
}
*/
const listeners = new Set(); //监听器

export function setCanvasX(x){
        xy['x'] = x
}
export function setCanvasY(y){
        xy['y'] = y
}
export function getCanvasXY(){
        return xy
}
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
                                        content[i]['x'][0] + xy['x'] < x && 
                                        content[i]['y'][0] + xy['y'] < y &&
                                        content[i]['x'][1] + xy['x'] > x &&
                                        content[i]['y'][1] + xy['y'] > y
                                ) return content[i]['id'];
                                break
                        case 'image':
                                if(
                                        content[i]['x'] + xy['x'] < x &&
                                        content[i]['y'] + xy['y'] < y &&
                                        content[i]['x'] + content[i]['width'] + xy['x'] > x &&
                                        content[i]['y'] + content[i]['height'] + xy['y'] > y
                                ) return content[i]['id'];
                                break
                        case 'text':
                                if(
                                        content[i]['x'] + xy['x'] < x &&
                                        content[i]['y'] + xy['y'] - 50 < y &&
                                        content[i]['x'] + content[i]['pxlong'] + xy['x'] > x &&
                                        content[i]['y'] + xy['y'] > y

                                ) return content[i]['id'];
                                break
                }
                
        }
        return false
}

function notifyListeners() {
        listeners.forEach(callback => callback(content));
}

