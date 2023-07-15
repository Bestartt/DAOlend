<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>


<template>
    <base-deposits :address="address"></base-deposits>
</template>
