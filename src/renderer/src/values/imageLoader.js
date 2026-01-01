const imageStore = {};
const imageLoaded = {};
/*
{id:"string",src=data}
*/
export function preloadImages(list) {
        const tasks = list.map(({ id, src }) => {
                return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => {
                                imageStore[id] = img;
                                imageLoaded[id] = true;
                                resolve();
                        };
                        img.onerror = reject;
                });
        });
        return Promise.all(tasks);
}

export function getImage(id) {
        return imageStore[id];
}

export function isImageLoaded(id) {
        return !!imageLoaded[id];
}