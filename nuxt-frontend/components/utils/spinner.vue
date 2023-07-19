<script lang="ts" setup>
    let props = defineProps<{pending: boolean}>();
</script>

<template>
    <div v-if="props.pending" class="w-full h-10vh flex justify-center items-center" >
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>            
    </div>
</template>
