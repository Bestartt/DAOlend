<script setup lang="ts">
    import { TransactionInfo } from '~/utils/transaction';

    let props = defineProps<{address: string}>();
    let address = props.address;
    let contract = new Contract(address);

    let transactions = ref<TransactionInfo[]>([]);
    let members = ref([]);

    let network = ref("");
    let loading = ref(false);
    let networkIsLocal = ref(false);


    async function update() {
        loading.value = true;

        // @ts-ignore
        // if network is local (aka Hardhat or Ganache) there is no way to show history
        if (!NETWORK_NAMES.includes(network.value)) {
            networkIsLocal.value = true;
            loading.value = false;
            return;
        }

        transactions.value = await get_transactions(address);   
        transactions.value.filter((t) => t.methodName != 'unknown');
        transactions.value.reverse();

        
        members.value = [];

        transactions.value.map(async (t) => {
            members.value.push(await contract.getMember(t.from));
        })

        loading.value = false;
    }

    onMounted(async() => {
        loading.value = true;
        network.value = (await connection.getNetwork()).name;
        await update();
    })

</script>


<template>

    <div pb-16>

        <!-- head -->
        <div flex justify-between>
            <h4>История</h4>
            <button  class="btn btn-dark" @click="update()">обновить</button>
        </div>

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="loading">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>


        <!-- history not available -->
        <div v-if="networkIsLocal">
            <h4 text-gray>
                Нельзя видить историю локально
            </h4>
            <span text-gray>К сожалению просмотр транзакции в локальной сети не работает</span>            
        </div>


        <!-- transactions list -->
        <div v-for="(transaction, i) in transactions" class="card mt-3">

            <!-- action name and datetime -->
            <div class="card-header flex justify-between">
                <div class="">
                    <span class="text-sm text-gray">действие</span> <br>
                    <b>{{ actions_dict[transaction.methodName] }}</b>   
                </div>
                
                <span>{{ new Date(transaction.timeStamp * 1000).toLocaleString() }}</span>
            </div>
            
            <div class="card-body row items-center">

                <!-- sent data -->
                <div class="flex flex-col col-3">
                    <template v-if="transaction.methodName == 'repay'">
                        <i>месяц: {{ transaction.argument.month }}</i>
                        <i>сумма: {{ transaction.argument.amount }}</i>
                    </template>

                    <template v-if="transaction.methodName == 'createCreditRequest'">
                        <i>имя кредитора: {{ transaction.argument.deptor }}</i>
                        <i>сумма: {{ transaction.argument.amount }}</i>
                        <i>срок: {{ transaction.argument.term }}</i>
                    </template>

                    <template v-if="transaction.methodName == 'deposit'">
                        <i>сумма: {{ transaction.argument[0] }}</i>
                    </template>

                    <template v-if="transaction.methodName == 'approveCreditRequest'">
                        <i>номер кредита: {{ transaction.argument[0] }}</i>
                    </template>

                    <template v-if="transaction.methodName == 'createJoinRequest'">
                        <i>заявитель: {{ transaction.argument[0] }}</i>
                    </template>

                    <!-- {{ transaction.argument }} -->
                </div>


                <!-- messager details -->
                <div class="col-9">
                    <span>участник: </span>
                    <b class="truncat">{{ members[i].name }}</b> <br>
                    <i>адрес: {{ transaction.from }}</i>

                    <button class="btn btn-light btn-sm mb-1 ms-2" @click="copy(transaction.from)">копировать</button>

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
