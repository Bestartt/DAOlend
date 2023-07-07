<script setup lang="ts">
    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
</script>


<template>
    <base-credit-requests :address="address"></base-credit-requests>
</template>
