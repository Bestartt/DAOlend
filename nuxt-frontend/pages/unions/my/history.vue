<script setup lang="ts">
    import { TransactionInfo } from 'utils/transaction';

    definePageMeta({layout: "my-union"})


    let address = my_union.get();
    let transactions = ref<TransactionInfo[]>([]);


    onMounted(async() => {
        transactions.value = await get_transactions(address);
    })


</script>


<template>

    <div>
        <h3 mt-5>История</h3>

    </div>
    

    
</template>

