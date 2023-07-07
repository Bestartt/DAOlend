<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>


<template>
    <base-members :address="address"></base-members>
</template>