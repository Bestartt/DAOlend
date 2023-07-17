<script lang="ts" setup>
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
</script>

<template>
    <base-index :address="address" :my="true"></base-index>
</template>
