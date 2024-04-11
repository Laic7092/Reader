<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { handleBookChange } from "../modules/bookManager"
const fileInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
    fileInput.value?.addEventListener('change', handleBookChange)
})
</script>
<template>
    <div>
        <label for="book">添加图书</label>
        <input ref="fileInput" type="file" accept=".txt,.epub" multiple>
    </div>
</template>

<style scoped></style>