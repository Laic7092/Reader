<script setup lang="ts">
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
function back() {
    model.value = false
}
</script>
<template>
    <article>
        <header>
            <span>&lt;</span>
            <span>title</span>
            <img src="/vite.svg">
        </header>
        <main>
            main
        </main>
        <footer>footer</footer>
    </article>
</template>

<style scoped>
article {
    width: 60vw;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

@media (419px <=width <=719px) {
    article {
        width: 100vw;
    }
}
</style>