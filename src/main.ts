import './modules/pubSub'
import './modules/indexDb'
import './modules/init'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function useWorker() {
    const myWorker = new Worker("/src/modules/worker");
    myWorker.onmessage = (ev) => {
        console.log('msg-from-worker', ev.data)
        const { key, val } = ev.data
        if (key)
            window[key] = val

    }

    const htmlCanvas = document.createElement("canvas");
    htmlCanvas.classList.add('testC')
    const offscreen = htmlCanvas?.transferControlToOffscreen();

    setTimeout(() => {
        // document.body.firstElementChild.appendChild(htmlCanvas)
        myWorker.postMessage({
            canvas: offscreen
        }, [offscreen]);
    }, 2000)
}
useWorker()


createApp(App).mount('#app')
