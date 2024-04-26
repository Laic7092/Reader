<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { handleBookChange } from "../modules/bookManager"
const fileInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
    fileInput.value?.addEventListener('change', handleBookChange)
})
function importBook() {
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