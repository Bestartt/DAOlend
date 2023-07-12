<script lang="ts" setup>
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>

<template>
    <base-index :address="address"></base-index>
</template>
