<script setup lang="ts">
    let props = defineProps<{loading: boolean}>();

</script>


<template>
    <template v-if="props.loading">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        waiting...
    </template>
    <template v-else>
        <slot></slot>
    </template>    
</template>
