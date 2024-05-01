<script setup lang="ts">
    import { onMounted, ref } from 'vue';

    interface Para {
        content: string
        measureHeight: number
        realHeight: number
    }
    const props = defineProps<{
        item: Para
    }>()

    const pRef = ref<null | HTMLElement>(null)
    onMounted(() => {
        if (pRef.value) {
            props.item.realHeight = pRef.value.clientHeight
        }
    })
</script>
<template>
    <p ref="pRef">
        <slot></slot>        
    </p>
</template>