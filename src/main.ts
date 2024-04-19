import './modules/pubSub'
import './modules/indexDb'
import './modules/init'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


const myWorker = new Worker("/src/modules/worker1");
myWorker.onmessage = (ev) => {
    console.log(ev.data)
}

const htmlCanvas = document.createElement("canvas");
htmlCanvas.width = 430
htmlCanvas.height = 930
// document.body.appendChild(htmlCanvas)
const offscreen = htmlCanvas?.transferControlToOffscreen();

setTimeout(() => {
    myWorker.postMessage({
        canvas: offscreen
    }, [offscreen]);
}, 2000)

createApp(App).mount('#app')
