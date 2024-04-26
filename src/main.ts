import './modules/pubSub'
import './modules/indexDb'
// import './modules/init'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function useWorker() {
    const myWorker = new Worker("/src/modules/worker1");
    myWorker.onmessage = (ev) => {
        console.log(ev.data)
    }

    const htmlCanvas = document.createElement("canvas");
    htmlCanvas.width = 430
    htmlCanvas.height = 930
    const offscreen = htmlCanvas?.transferControlToOffscreen();

    setTimeout(() => {
        myWorker.postMessage({
            canvas: offscreen
        }, [offscreen]);
    }, 2000)
}


createApp(App).mount('#app')
