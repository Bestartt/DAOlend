<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>


<template>
    <base-history :address="address"></base-history>
</template>
