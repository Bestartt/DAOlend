<script setup lang="ts">
    definePageMeta({layout: "my-union"})


    let address = get_my_union();
    let transactions = ref([]);


    onMounted(async() => {
        transactions.value = await get_transactions_list(address);
        console.log(transactions.value)
        console.log(transactions.value[1].methodId)
        console.log(getMethodName(transactions.value[1]));
        console.log(getTransactionParams(transactions.value[1]));
    })


</script>


<template>

    <div>
        <h3 mt-5>История</h3>
   
    </div>
    

    
</template>

