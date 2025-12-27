
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

export default function renderCanvas(canvas, content) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        

        //绘制背景
        ctx.fillStyle = '#0099ff';
        ctx.fillRect(0, 0, width, height);
        drawGrid(ctx, width, height);

        for(var i=0;i<content.length;i++){
               
                switch(content[i]["command"]){
                        case "fill":
                                ctx.fillStyle = content[i]["color"];
                                ctx.fillRect(
                                        content[i]['x'][0], 
                                        content[i]['y'][0], 
                                        content[i]['x'][1] - content[i]['x'][0],
                                        content[i]['y'][1] - content[i]['y'][0]
                                );
                                break;
                        case 'image':
                                ctx.drawImage(
                                        content[i]['image'],
                                        content[i]['x'],
                                        content[i]['y'],
                                        content[i]['width'],
                                        content[i]['height']
                                );
                                break;
                        case 'text':
                                ctx.font = "50px serif";
                                ctx.fillStyle = "#ffffff";
                                ctx.fillText(
                                        content[i]['text'],
                                        content[i]['x'],
                                        content[i]['y'],
                                        content[i]['maxW']
                                )
                                break;
                }       
        }


}