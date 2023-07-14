<script lang="ts" setup>

    let props = defineProps<{loading: boolean}>();

</script>



<template>
    <div class="loading-container" v-show="props.loading">
        <div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>


<style scoped>
    .loading-container {
        position: absolute;
        width: 100vw;
        height: 90vh;
        background-color: rgba(98, 98, 98, 0.179);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

</style>

