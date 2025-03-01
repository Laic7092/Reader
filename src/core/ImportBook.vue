<script setup lang="ts">
import { ref } from 'vue';
const fileInput = ref<HTMLInputElement | null>(null)
let moduleLoaded = false
async function importBook() {
    try {
        if (!moduleLoaded) {
            loadModule()
        } else {
            fileInput.value?.click()
        }
    } catch (error) {
        loadModule()
    }
}

async function loadModule() {
    const { handleBookChange } = await import('../modules/bookManager')
    fileInput.value?.addEventListener('change', handleBookChange)
    moduleLoaded = true
    fileInput.value?.click()
}
</script>
<template>
    <div class="top-right no-touch">
        <button @click="importBook">Import Book +</button>
        <input ref="fileInput" type="file" v-show="false" accept=".txt,.epub" multiple style="display:none;">
    </div>
</template>

<style scoped>
.top-right {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1em;
    text-align: right;
}
</style>