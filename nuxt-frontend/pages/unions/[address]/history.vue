<script setup lang="ts">
    import { TransactionInfo } from '~/utils/transaction';
    
    definePageMeta({layout: "union"})
    let route = useRoute();
    
    // @ts-ignore
    let address: string = route.params.address;
    
    let transactions = ref<TransactionInfo[]>([]);
    let members = ref([]);

    let network = ref("");
    let loading = ref(false);
    let networkIsLocal = ref(false);


    async function update() {
        let contract = new Contract(address);
        loading.value = true;

        // @ts-ignore
        // if network is local (aka Hardhat or Ganache) there is no way to show history
        if (!NETWORK_NAMES.includes(network.value)) {
            networkIsLocal.value = true;
            loading.value = false;
            return;
        }

        transactions.value = await get_transactions(address);   
        transactions.value = transactions.value.filter((t) => t.methodName != null);
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
            <h4>History</h4>
            <button  class="btn btn-dark" @click="update()">refresh</button>
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
                Impossible to get history on local network
            </h4>
            <span text-gray>Unfortunately local network history view does not work</span>            
        </div>


        <div v-if="transactions.length == 0 && !loading && !networkIsLocal">
            <h3 text-gray>Empty</h3>
            <b text-gray>No actions yet</b>
        </div>

        <div v-auto-animate>
            <div v-for="(transaction, i) in transactions" class="card mt-3">

                <div class="card-header flex justify-between">
                    <div class="">
                        <span class="text-sm text-gray">action</span> <br>
                        <b>{{ actions_dict[transaction.methodName] }}</b>   
                    </div>
                    
                    <span>{{ new Date(transaction.timeStamp * 1000).toLocaleString() }}</span>
                </div>
                
                <div class="card-body row items-center">

                    <div class="flex flex-col col-12 col-md-3">
                        <template v-if="transaction.methodName == 'createRepayment'">
                            <i>month: {{ transaction.argument.month }}</i>
                            <i>amount: {{ transaction.argument.amount }}</i>
                        </template>

                        <template v-if="transaction.methodName == 'createCredit'">
                            <i>creditor's name: {{ transaction.argument.deptor }}</i>
                            <i>amount: {{ transaction.argument.amount }}</i>
                            <i>срок: {{ transaction.argument.term }}</i>
                        </template>

                        <template v-if="transaction.methodName == 'createDeposit'">
                            <i>amount: {{ transaction.argument[0] }}</i>
                        </template>

                        <template v-if="transaction.methodName == 'approveCredit'">
                            <i>credit number: {{ transaction.argument[0] }}</i>
                        </template>

                        <template v-if="transaction.methodName == 'createJoin'">
                            <i>applicant: {{ transaction.argument[0] }}</i>
                        </template>

                    </div>


                    <div class="col-9">
                        <span>member: </span>
                        <nuxt-link :to="`/unions/${address}/${members[i].member}/member-detail/`" class="dark-link">

                            {{ members[i].name }}
                        </nuxt-link>
                        <b class="truncat">
                        </b> <br>
                        <i>address: {{ transaction.from }}</i>

                        <button class="btn btn-light btn-sm mb-1 ms-2" @click="copy(transaction.from)">copy</button>

                    </div>
                
                </div>                
            </div>

        </div>
        <!-- transactions list -->


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
