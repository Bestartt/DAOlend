<script lang="ts" setup>
    definePageMeta({layout: "my-union"});

    let route = useRoute();
    let member = route.params.member;

    let address = my_union.get();
</script>

<template>
    <base-member-detail :contract="address" :member="member"></base-member-detail>
</template>
