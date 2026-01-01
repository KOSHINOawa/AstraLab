import { getRender, replaceRender, getCanvasXY, returnCanvasSize, addToRender, removeFromRender } from "../values/ctx_content"
import '../values/settings'
import { getSetting } from "../values/settings";
import '../values/imageLoader'
import { getImage } from "../values/imageLoader";
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
function fillLine(ctx, content) {
        switch (content['command']) {
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
                                content['pxlong'],
                                0 - content['size']
                        )
                        break
        }
}
export function getCtx(canvas) {
        return canvas.getContext('2d')
}
export default function renderCanvas(canvas, content) {
        let textLong = {
                "long": 0,
                "where": 0
        };
        const ctx = getCtx(canvas)
        const scale = returnCanvasSize();

        ctx.setTransform(1, 0, 0, 1, 0, 0); //重置矩阵(缩放)
        ctx.scale(scale, scale)

        const { width, height } = canvas;

        const canvasWidth = width / scale;
        const canvasHeight = height / scale;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1
        //绘制背景
        ctx.fillStyle = '#0099ff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        drawGrid(ctx, canvasWidth, canvasHeight);

        for (var i = 0; i < content.length; i++) {
                let com = content[i];
                if (getSetting("enable_highLight_box")) fillLine(ctx, com)
                ctx.globalCompositeOperation = "normal"; //别问这行为什么多余，不加这行会有一段时间显示有问题
                ctx.globalAlpha = 1
                switch (com["command"]) {
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
                                ctxDisplayImage(com, ctx)

                                break;
                        case 'text':
                                ctx.font = `${com['size']}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
                                ctx.fillStyle = com['color'];
                                ctx.fillText(
                                        com['text'],
                                        com['x'] + getCanvasXY()['x'],
                                        com['y'] + getCanvasXY()['y'],
                                        com['maxW']
                                );
                                textLong["long"] = ctx.measureText(com['text']).width;
                                if (i != 0) {
                                        let changeLong = getRender()[i]
                                        if (changeLong["long"] === undefined) {
                                                changeLong["pxlong"] = textLong["long"]
                                                replaceRender(i, changeLong)
                                        }
                                }
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
        effectWork(content)


}
function ctxDisplayImage(com, ctx) {
        ctx.save();
        switch (com.thing) {
                case "火焰":
                        ctx.globalCompositeOperation = "normal";
                        ctx.globalAlpha = com.alpha;
                        ctx.drawImage(
                                getImage('fireEffect'),
                                com.x + getCanvasXY().x,
                                com.y + getCanvasXY().y,
                                30, 30);

                        break
                default:
                        ctx.globalAlpha = com['alpha'] == undefined ? 1 : com['alpha'] < 0 ? 0 : com['alpha'] > 1 ? 1 : com['alpha']
                        ctx.drawImage(
                                com.image,
                                com.x + getCanvasXY().x,
                                com.y + getCanvasXY().y,
                                com.width,
                                com.height
                        );
                        break
        }
        ctx.restore();
}
let step = 0
function effectWork(content) {
        //效果器
        step += 1
        const createObject = step % 10 == 0 ? true : false
        for (var j = 0; j < content.length; j++) {
                let com = content[j];
                switch (com.thing) {
                        case "酒精灯":
                                if (!createObject) break
                                addToRender({
                                        'id': `酒精灯火焰特效-${com.id}-${com.effect.fire}`,
                                        'thing': '火焰',
                                        'command': 'image',
                                        'image': getImage('fireEffect'),
                                        'x': com.x + 95,
                                        'y': com.y - 10,
                                        'height': 50,
                                        'width': 50,
                                        'alpha': 1,
                                        'canchange': false,
                                        'effect': {
                                                'progress': 0
                                        }
                                })
                                replaceRender(j,
                                        {
                                                ...com,
                                                'effect': {
                                                        ...com.effect,
                                                        'fire': com.effect.fire + 1
                                                }
                                        }
                                )
                                break
                        case "火焰":
                                replaceRender(j,
                                        {
                                                ...com,
                                                'y': com.y - 2 + 0.15,
                                                'x': com.x + 0.15,
                                                'alpha': com.alpha - 0.01,
                                                'height': com.height - 0.3,
                                                'width': com.width - 0.3,
                                                'effect': {
                                                        ...com.effect,
                                                        'progress': com.effect.progress + 1
                                                }
                                        }
                                )
                                if (com.alpha <= 0) {
                                        removeFromRender(com.id)
                                }
                                break
                }

        }
}