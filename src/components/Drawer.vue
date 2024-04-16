<script setup lang="ts">
import { computed, watch } from 'vue';

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

watch(model, (value) => {
    if (value) {
        open()
    } else[
        close()
    ]
}, { immediate: true })
function open() {
    const { style, classList } = document.body
    const scrollBarWidth = window.innerWidth - document.body.clientWidth
    if (scrollBarWidth > 0) {
        classList.add('keep-width')
        style.width = document.body.clientWidth + 'px'
        style.paddingRight = scrollBarWidth + 'px'
    }
    style.setProperty('touch-action', 'none')
    style.setProperty('overscroll-behavior', 'none')
    document.body.style.overflow = 'hidden'
}

function close() {
    const { style, classList } = document.body
    if (document.body.classList.contains('keep-width')) {
        classList.remove('keep-width')
        style.paddingRight = ""
        style.width = ""
    }
    style.removeProperty('touch-action')
    style.removeProperty('overscroll-behaviour')
    document.body.style.overflow = ""
}
</script>
<template>
    <Transition>
        <div role="dialog" class="overlay" aria-modal="true" v-if="model" @click.self="closeDrawer">
            <div class="drawer" :style="style">
                <div class="drawer-header flex-r-sbc ">
                    <span class="header-title">{{ title }}</span>
                    <img src="../assets/Close.svg" @click="closeDrawer" class="svg-btn border small">
                </div>
                <div class="drawer-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
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

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>