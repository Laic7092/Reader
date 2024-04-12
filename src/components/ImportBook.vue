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
    <div>
        <!-- <label for="book">添加图书</label> -->
        <button @click="importBook">import book</button>
        <input ref="fileInput" type="file" v-show="false" accept=".txt,.epub" multiple style="display:none;">
    </div>
</template>

<style scoped></style>