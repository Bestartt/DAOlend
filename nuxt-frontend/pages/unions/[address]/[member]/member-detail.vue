<script lang="ts" setup>
    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
    let member = route.params.member;
</script>

<template>
    <base-member-detail :contract="address" :member="member"></base-member-detail>
</template>
