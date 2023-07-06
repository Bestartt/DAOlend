<script setup lang="ts">
    import { TransactionInfo } from 'utils/transaction';

    definePageMeta({layout: "my-union"})

    const NETWORK_NAMES = ["homestead", "goerli", "sepolia", "mainnet"];


    let address = my_union.get();
    let transactions = ref<TransactionInfo[]>([]);
    let network = ref("");
    let loading = ref(false);

    let networkIsLocal = ref(false);

    onMounted(async() => {
        loading.value = true;
        network.value = (await connection.getNetwork()).name;

        debugger;

        if (NETWORK_NAMES.includes(network.value)) {
            transactions.value = await get_transactions(address);

            transactions.value.map((t) => {
                t.methodName = t.methodName != null ? t.methodName : "неизвестно"
            });            
        } else {
            networkIsLocal.value = true;
        }

        loading.value = false;
    })


</script>


<template>

    <div>
        <div flex justify-between>
            <h4>История</h4>
            <button  class="btn btn-dark">обновить</button>
        </div>

        <div class="w-full h-50vh flex justify-center items-center" v-if="loading">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>


        <div v-if="networkIsLocal">
            <h4 text-gray>
                Нельзя видить историю локально
            </h4>
            <span text-gray>К сожалению просмотр транзакции в локальной сети не работает</span>            
        </div>


        <div v-for="transaction in transactions" class="card card-body mt-3 flex flex-row justify-between items-center">
            <div class="flex flex-col">
                <span class="text-sm text-gray">действие</span>
                <b>{{ transaction.methodName }}</b>
                {{ transaction.argument }}
            </div>

            <div>
                <span>с адреса: </span>
                <b>{{ transaction.from }}</b>
            </div>

            <div>
                <span>{{ new Date(transaction.timeStamp * 1000).toLocaleString() }}</span>
            </div>

        </div>


    </div>
    

    
</template>

