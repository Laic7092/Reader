<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

const model = defineModel({ required: true })

const props = defineProps<{
    title: string
    height?: string
}>()

function closeDrawer() {
    model.value = false
}

const style = computed(() => {
    const { height } = props
    return {
        height
    }
})

onMounted(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth
    if (scrollBarWidth > 0) {
        document.body.classList.add('keep-width')
        document.body.style.width = document.body.clientWidth + 'px'
        document.body.style.paddingRight = scrollBarWidth + 'px'
    }
    document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
    if (document.body.classList.contains('keep-width')) {
        document.body.classList.remove('keep-width')
        document.body.style.paddingRight = ""
        document.body.style.width = ""
    }
    document.body.style.overflow = ""
})
</script>
<template>
    <div role="dialog" class="overlay" v-if="model" aria-modal="true">
        <div class="drawer" :style="style">
            <div class="flex-r-sbc drawer-header">
                <span class="header-title">{{ title }}</span>
                <img src="../assets/Close.svg" @click="closeDrawer" class="svg-btn border small">
            </div>
            <div class="drawer-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    -webkit-user-select: none;
    user-select: none;
}

.drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40vh;
    background-color: var(--fill-color);
    box-shadow: var(--box-shadow);
    border-radius: 1em 1em 0 0;
    display: flex;
    flex-direction: column;

    .border {
        border: 0.25rem solid var(--border-color);
        border-radius: 50%;
        background-color: var(--border-color);

        &.small {
            width: 1.5em;
            height: 1.5em;
        }
    }

    .drawer-header {
        flex: none;
        padding: 0.5em 1em;

        .header-title {
            font-size: 1.5em;
        }
    }

    .drawer-body {
        flex: auto;
        padding: 0.5em 1em;
        overflow-y: auto;
    }
}
</style>