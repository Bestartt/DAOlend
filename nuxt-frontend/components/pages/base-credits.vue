<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;
    
    let contract: Contract = new Contract(address);
    let currentCredit = ref(-1);
    
    let { data, pending, refresh } = useAsyncData(async () => contract.getCredits());
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

        <div v-if="!pending">
            <template v-for="credit in data">
                <div class="card card-body max-w-400px">
                    <!-- data -->
                    <p>
                        заемщик: {{ credit[1] }} <br>
                        сумма: {{ credit[2] }} <br>  
                        срок: {{ credit[3] }} месяцев <br>
                        погашено: {{ credit[4] }}              
                    </p>

                    <!-- actions -->
                    <router-link :to="`/unions/${address}/${credit[0]}/repayments`" class="btn btn-outline-dark">
                        погашения
                    </router-link>

                    <button 
                        v-if="credit[5].toLocaleLowerCase() == userAddress"
                        mt-2
                        data-bs-toggle="modal"
                        data-bs-target="#repay"
                        @click="currentCredit = credit[0]" 
                        class="btn btn-dark" 
                    >
                        Создать погашение
                    </button>

                </div>
            </template> 
        </div>
       

        
        <repay-modal :address="address" :creditId="currentCredit"/>

    </div>



</template>
