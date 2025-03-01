<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import type { Component } from 'vue'
import Home from '../pages/Home.vue';

const Read = defineAsyncComponent(() => import('../pages/Read.vue'))
const Config = defineAsyncComponent(() => import('../pages/Config.vue'))

window.location.hash = '#/'

interface Routes {
    [key: string]: Component
}
const routes: Routes = {
    '/': Home,
    '/read': Read,
    '/config': Config
}
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})
const currentView = computed(() => {
    const key = currentPath.value.slice(1) as keyof typeof routes
    return routes[key || '/']
})
</script>
<template>
    <KeepAlive>
        <component :is="currentView" />
    </KeepAlive>
</template>