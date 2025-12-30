import {getRender, replaceRender, getCanvasXY, returnCanvasSize} from "../values/ctx_content"
import '../values/settings'
import { getSetting } from "../values/settings";

function drawGrid(ctx, width, height) {
        const gridSize = 20; // 网格大小
        const gridColor = 'rgba(255, 255, 255, 0.2)'; // 网格颜色和透明度

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // 绘制垂直线
        for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
        }

        // 绘制水平线
        for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
        }
}
function fillLine(ctx,content){
        switch(content['command']){
                case 'fill':
                        ctx.strokeStyle = "#00ff00"
                        ctx.strokeRect(
                                content['x'][0] + getCanvasXY()['x'],
                                content['y'][0] + getCanvasXY()['y'],
                                content['x'][1] - content['x'][0],
                                content['y'][1] - content['y'][0]
                        )
                        break
                case 'image':
                        ctx.strokeStyle = "#00ff00"
                        ctx.strokeRect(
                                content['x'] + getCanvasXY()['x'],
                                content['y'] + getCanvasXY()['y'],
                                content['x'] + content['width'],
                                content['y'] + content['height']
                        )
                        break
                case 'text':
                        ctx.strokeStyle = "#00ff00"
                        ctx.strokeRect(
                                content['x'] + getCanvasXY()['x'],
                                content['y'] + getCanvasXY()['y'],
                                ctx.measureText(content['text']).width,
                                -50
                        )
                        break
        }
}
export function getCtx(canvas){
        return canvas.getContext('2d')
}
export default function renderCanvas(canvas, content) {
        let textLong = {
                "long":0,
                "where":0
        };
        const ctx = getCtx(canvas)
        const scale = returnCanvasSize();
        
        ctx.setTransform(1, 0, 0, 1, 0, 0); //重置矩阵(缩放)
        ctx.scale(scale, scale) 

        const { width, height } = canvas;

        const canvasWidth = width / scale;
        const canvasHeight = height /scale;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        //绘制背景
        ctx.fillStyle = '#0099ff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        drawGrid(ctx, canvasWidth, canvasHeight);
        
        for(var i=0;i<content.length;i++){
                let com = content[i];
                if (getSetting("enable_highLight_box")) fillLine(ctx, com)
                switch (com["command"]){
                        case "fill":
                                ctx.fillStyle = com["color"];
                                ctx.fillRect(
                                        com['x'][0] + getCanvasXY()['x'], 
                                        com['y'][0] + getCanvasXY()['y'], 
                                        com['x'][1] - com['x'][0],
                                        com['y'][1] - com['y'][0]
                                );
                                break;
                        case 'image':
                                ctx.drawImage(
                                        com['image'],
                                        com['x'] + getCanvasXY()['x'],
                                        com['y'] + getCanvasXY()['y'],
                                        com['width'],
                                        com['height']
                                );
                                break;
                        case 'text':
                                ctx.font = "50px Microsoft-YaHei";
                                ctx.fillStyle = com['color'];
                                ctx.fillText(
                                        com['text'],
                                        com['x'] + getCanvasXY()['x'],
                                        com['y'] + getCanvasXY()['y'],
                                        com['maxW']
                                );
                                textLong["where"] = i;
                                textLong["long"] = ctx.measureText(com['text']).width;
                                break;
                        case 'stroke':
                                ctx.lineWidth = 3;
                                ctx.strokeStyle = com['color']
                                ctx.strokeRect(
                                        com['x'] + getCanvasXY()['x'],
                                        com['y'] + getCanvasXY()['y'],
                                        com['width'],
                                        com['height']
                                );
                                break
                }       
                
        }
        if(textLong['where'] != 0){
                let changeLong = getRender()[textLong["where"]]
                if(changeLong["long"] == undefined){
                        changeLong["pxlong"] = textLong["long"]
                        replaceRender(textLong['where'],changeLong)
                }
        }
}