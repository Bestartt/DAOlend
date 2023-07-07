<script setup lang="ts">
    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
</script>


<template>
    <base-credits :address="address"></base-credits>
</template>
