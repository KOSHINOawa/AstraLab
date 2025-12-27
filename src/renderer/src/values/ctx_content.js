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

// 添加到渲染队列
export function addToRender(data) {
        content.push(data);
        notifyListeners(); 
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

function notifyListeners() {
        listeners.forEach(callback => callback(content));
}
