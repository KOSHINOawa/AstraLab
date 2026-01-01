let content = [];
let xy = { "x": 0, "y": 0 };
let TouchObject = {};
let canvasSize = 1;
/*
格式
{
        "id":...,
        "command":...,
        ---
}
*/
const listeners = new Set(); //监听器
export function changeCanvasSizeBy(num) {
        canvasSize += num;
}
export function returnCanvasSize() {
        return canvasSize;
}
export function setSelectObject(object) {
        TouchObject = object
}
export function returnSelectObject() {
        return TouchObject
}
export function setCanvasX(x) {
        xy['x'] = x
}
export function setCanvasY(y) {
        xy['y'] = y
}
export function getCanvasXY() {
        return xy
}
export function getRender() {
        return content
}

export function setRenderTo(data) {
        content = data;
}

// 添加到渲染队列
export function addToRender(data) {
        content.push(data);
        notifyListeners();
}

export function whereIsObject(id){
        for (var i = 0; i < content.length; i++) {
                if (content[i]["id"] == id) {
                        return i
                }
        }
}
export function replaceRender(where, data) {
        content[where] = data
}
export function removeFromRender(id) {
        for (var i = 0; i < content.length; i++) {
                if (content[i]["id"] == id) {
                        content.splice(i, 1)
                }
        }
        notifyListeners();
}

export function clearRender() {
        content = [];
        notifyListeners();
}

export function isMouseTouchingAnything(x, y) {
        const MouseX = x / canvasSize;
        const MouseY = y / canvasSize;
        const contentNow = JSON.parse(JSON.stringify(content))
        for (var i = 0; i < contentNow.length; i++) {
                switch (contentNow[i]['command']) {
                        case 'fill':
                                if (
                                        contentNow[i]['x'][0] + xy['x'] < MouseX &&
                                        contentNow[i]['y'][0] + xy['y'] < MouseY &&
                                        contentNow[i]['x'][1] + xy['x'] > MouseX &&
                                        contentNow[i]['y'][1] + xy['y'] > MouseY
                                ) return contentNow[i]['id'];
                                break
                        case 'image':
                                if (
                                        contentNow[i]['x'] + xy['x'] < MouseX &&
                                        contentNow[i]['y'] + xy['y'] < MouseY &&
                                        contentNow[i]['x'] + contentNow[i]['width'] + xy['x'] > MouseX &&
                                        contentNow[i]['y'] + contentNow[i]['height'] + xy['y'] > MouseY
                                ) return contentNow[i]['id'];
                                break
                        case 'text':
                                console.log(content[i]['id'], 
                                        contentNow[i]['pxlong'] 
                                )
                                if (
                                        contentNow[i]['x'] + xy['x'] < MouseX &&
                                        contentNow[i]['y'] + xy['y'] - contentNow[i]['size'] < MouseY &&
                                        contentNow[i]['x'] + contentNow[i]['pxlong'] + xy['x'] > MouseX &&
                                        contentNow[i]['y'] + xy['y'] > MouseY

                                ) {
                                        return contentNow[i]['id'];
                                }
                                break
                }

        }
        return false
}
export function mouseTouchObject(x, y) {
        const MouseX = x / canvasSize;
        const MouseY = y / canvasSize;
        
        for (var i = 0; i < content.length; i++) {
                switch (content[i]['command']) {
                        case 'fill':
                                if (
                                        content[i]['x'][0] + xy['x'] < MouseX &&
                                        content[i]['y'][0] + xy['y'] < MouseY &&
                                        content[i]['x'][1] + xy['x'] > MouseX &&
                                        content[i]['y'][1] + xy['y'] > MouseY
                                ) return content[i];
                                break
                        case 'image':
                                if (
                                        content[i]['x'] + xy['x'] < MouseX &&
                                        content[i]['y'] + xy['y'] < MouseY &&
                                        content[i]['x'] + content[i]['width'] + xy['x'] > MouseX &&
                                        content[i]['y'] + content[i]['height'] + xy['y'] > MouseY
                                ) return content[i];
                                break
                        case 'text':
                                if (
                                        content[i]['x'] + xy['x'] < MouseX &&
                                        content[i]['y'] + xy['y'] - content[i]['size'] < MouseY &&
                                        content[i]['x'] + content[i]['pxlong'] + xy['x'] > MouseX &&
                                        content[i]['y'] + xy['y'] > MouseY

                                ) return content[i];
                                break
                }

        }
        return {}
}

function notifyListeners() {
        listeners.forEach(callback => callback(content));
}

