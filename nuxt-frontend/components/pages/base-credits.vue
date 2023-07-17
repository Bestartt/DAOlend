<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;
    
    let contract: Contract = new Contract(address);
    let currentCredit = ref(-1);
    
    let { data, pending, refresh } = useAsyncData(async () => (await contract.getCredits()).filter(c => c.confirmed));
    let userAddress = ref(connection.getCurrentUserAddress());


</script>

<template>
    <div>
        <!-- head -->

        <div flex justify-between>
            <h4>Кредиты</h4>
            <button @click="refresh()" class="btn btn-dark">обновить</button>
        </div>
        <br>

        <div v-if="data && data.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <!-- credit list -->

        <div v-if="!pending" v-auto-animate>
            <template v-for="credit in data">
                <div class="card max-w-500px">
                    <h5 class="card-header">
                        <b>
                            заемщик: {{ credit.name }}
                        </b>
                    </h5>

                    <!-- data -->
                    <div class="card-body">
                        сумма: {{ credit.amount }} <br>  
                        срок: {{ credit.term }} месяцев <br>
                        погашено: {{ credit.repaid }} <br>

                        <br>
                        <!-- actions -->                        
                        <button 
                            @click="currentCredit = credit.id"  
                            class="btn btn-outline-dark me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#repayments_list"    
                        >
                            погашения
                        </button>

                        <button 
                            v-if="credit[5].toLocaleLowerCase() == userAddress"
                            data-bs-toggle="modal"
                            data-bs-target="#repay"
                            @click="currentCredit = credit[0]" 
                            class="btn btn-dark" 
                        >
                            Создать погашение
                        </button>                                   
                    </div>



                </div>
            </template> 
        </div>
       
        <template v-if="currentCredit !== -1">
            <repayments-list-modal :contract-address="address" :credit-id="currentCredit"></repayments-list-modal>        
        </template>

        <repay-modal :address="address" :creditId="currentCredit"/>

    </div>



</template>
