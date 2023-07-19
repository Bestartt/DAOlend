<script setup lang="ts">
    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
    let creditId = route.params.id;
</script>


<template>
    <base-repayments :address="address" :credit-id="creditId"></base-repayments>
</template>
