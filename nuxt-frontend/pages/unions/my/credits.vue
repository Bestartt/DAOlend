<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>


<template>
    <base-credits :address="address" :my="true"></base-credits>
</template>
