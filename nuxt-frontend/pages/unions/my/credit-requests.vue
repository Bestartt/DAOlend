<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>


<template>
    <base-credit-requests :address="address"></base-credit-requests>
</template>
