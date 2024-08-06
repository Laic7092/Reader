<script setup lang="ts">
import { computed, watch } from 'vue';
import { lockBody, unLockBody, isInReader } from '../modules/utils';

const model = defineModel({ required: true })

const props = defineProps<{
    title?: string
    height?: string
    closeIconOffset?: string
}>()

const emit = defineEmits<{
    (e: 'open'): void
    (e: 'close'): void
}>()

function closeDrawer() {
    model.value = false
    emit('close')
}

const style = computed(() => {
    const { height } = props
    return {
        height
    }
})

watch(model, value => value ? open() : close())
function open() {
    emit('open')
    lockBody()
}

function close() {
    unLockBody()
    isInReader() && document.body.style.setProperty('overflow', 'hidden')
}
</script>
<template>
    <Transition name="slide-fade1">
        <div role="dialog" class="overlay" aria-modal="true" v-if="model" @click.self="closeDrawer">
            <div class="drawer no-touch" :style="style">
                <div class="drawer-header flex-r-sbc ">
                    <span class="header-title">{{ title }}</span>
                    <img src="../assets/Close.svg" @click="closeDrawer" class="svg-btn border small no-touch"
                        :style="{ 'margin-right': closeIconOffset }">
                </div>
                <div class="drawer-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
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
        padding: 0.5em 1.25em;

        .header-title {
            font-size: 1.5em;
        }
    }

    .drawer-body {
        flex: auto;
        padding: 0.5em 1.25em;
        overflow-y: auto;
    }
}
</style>