<script setup lang="ts">

    import { TransactionInfo } from '~/utils/transaction';

    definePageMeta({layout: "union"})

    const NETWORK_NAMES = ["homestead", "goerli", "sepolia", "mainnet"];

    let route = useRoute();
    let address = route.params.address;
    let transactions = ref<TransactionInfo[]>([]);
    let members = ref([]);

    let network = ref("");
    let loading = ref(false);

    let networkIsLocal = ref(false);


    async function update() {
        loading.value = true;

        if (NETWORK_NAMES.includes(network.value)) {
            transactions.value = await get_transactions(address);   
            transactions.value.filter((t) => t.methodName != null);

            let contract = new Contract(address);

            transactions.value.map(async (t) => {
                members.value.push(await contract.getMember(t.from));
            })

        } else {
            networkIsLocal.value = true;
        }

        loading.value = false;
    }

    onMounted(async() => {
        loading.value = true;
        network.value = (await connection.getNetwork()).name;

        await update();
    })

</script>


<template>

    <div>
        <div flex justify-between>
            <h4>История</h4>
            <button  class="btn btn-dark" @click="update()">обновить</button>
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


        <div v-for="(transaction, i) in transactions" class="card card-body mt-3">
            <div class="row items-center">
                <div class="flex flex-col col-4">
                    <span class="text-sm text-gray">действие</span>
                    <b>{{ actions_dict[transaction.methodName] }}</b>
                    {{ transaction.argument }}
                </div>

                <div class="col-6">
                    <span>участник: </span>
                    <b class="truncat">{{ members[i].name }}</b> <br>
                    <i>адрес: {{ truncateString(transaction.from) }}</i>

                    <button class="btn btn-light btn-sm mb-1 ms-2" @click="copy(transaction.from)">копировать</button>

                </div>

                <div class="col-2">
                    <span>{{ new Date(transaction.timeStamp * 1000).toLocaleString() }}</span>
                </div>                
            </div>


        </div>


    </div>
    

    
</template>


<style>
    .truncat {
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
