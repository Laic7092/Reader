<script setup lang="ts">
import { computed } from 'vue';

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
</script>
<template>
    <div class="wrapper" v-if="model">
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
.wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    /* background-color: transparent; */
}

.drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40vh;
    height: 50dvh;
    background-color: dimgray;
    border-radius: 1em 1em 0 0;

    .border {
        border: 0.25rem solid #CFD3DC;
        border-radius: 50%;
        background-color: #CFD3DC;

        &.small {
            width: 1.5em;
            height: 1.5em;
        }
    }

    .drawer-header {
        padding: 0.5em 1em;

        .header-title {
            font-size: 1.5em;
        }
    }

    .drawer-body {
        padding: 0.5em 1em;
    }
}
</style>