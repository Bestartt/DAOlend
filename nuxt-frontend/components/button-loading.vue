<script setup lang="ts">
    let loading = defineProp<boolean>("loading");

</script>


<template>
    <template v-if="loading">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ожидание...
    </template>
    <template v-else>
        <slot></slot>
    </template>    
</template>
