<script lang="ts" setup>
    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
</script>

<template>
    <base-index :address="address" :my="false"></base-index>
</template>
