<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import Home from '../pages/Home.vue';
import Reader from '../pages/Reader.vue';
import Config from '../pages/Config.vue';

window.location.hash = '#/'

interface Routes {
    [key: string]: Component
}
const routes: Routes = {
    '/': Home,
    '/reader': Reader,
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