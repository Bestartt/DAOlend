<script setup lang="ts">
    definePageMeta({layout: "my-union"})

    
    let route = useRoute();
    let creditId = route.params.id;
    let address = my_union.get();
    

</script>


<template>
    <base-repayments :address="address" :credit-id="creditId"></base-repayments>
</template>
