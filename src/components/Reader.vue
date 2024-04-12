<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Book } from '../modules/indexDb';

// 使 v-model 必填
const model = defineModel({ required: true })
const props = defineProps<{
    curBook: Book
}>()

// 提供一个默认值
function back() {
    model.value = false
}

const catelog = ref<Array<string>>([])
const catelogVisible = ref(false)
function showCatelog() {
    catelogVisible.value = true
}
onMounted(() => {
    console.log('阅读页加载中', props.curBook)
})
</script>
<template>
    <article>
        <nav v-if="catelogVisible" class="catelog">
            catelogs
        </nav>
        <header>
            <span @click="back" class="backBtn">&lt;</span>
            <span class="title">{{ curBook.name }}</span>
            <img src="/vite.svg" @click="showCatelog">
        </header>
        <main>
            main
        </main>
        <!-- <footer>footer</footer> -->
    </article>
</template>

<style scoped>
article {
    width: 60vw;

    .catelog {
        position: absolute;
        left: 0;
        top: 0;
    }
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .backBtn {
            font-size: 3rem;
            font-weight: 600;
            color: var(--color-primary);
            cursor: pointer;
        }

        .title {
            font-size: 2rem;
        }
    }
}

@media (419px <=width <=719px) {
    article {
        width: 100vw;
    }
}
</style>