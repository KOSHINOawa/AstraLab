

export default function renderCanvas(canvas, content) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        //绘制背景
        ctx.fillStyle = '#0099ff';
        ctx.fillRect(0, 0, width, height);
        
        for(var i=0;i<content.length;i++){
                console.log("Renderer is Rendering "+content[i])
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