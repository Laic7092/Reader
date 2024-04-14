<script setup lang="ts">
const model = defineModel({ required: true })

</script>
<template>
    <div class="drawer" v-if="model">
        <slot></slot>
    </div>
</template>

<style scoped>
.drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80vh;
    height: 95dvh;
    background-color: darkgray;
    border-radius: 1em 1em 0 0;
}
</style>