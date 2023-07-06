<script setup lang="ts">
    import { Contract } from "~/utils/contract";

    definePageMeta({layout: "my-union"})


    let address = get_my_union();
    let contract: Contract;
    let credits = ref<any>(null);
    let currentCredit = ref(-1);
    

    function update() {
        contract = new Contract(address);
        contract.getCredits().then(d => credits.value = d);
    }

    onMounted(update)

</script>

<template>
    <div>
        <!-- head -->

        <div flex justify-between>
            <h4>Кредиты</h4>
            <button @click="update()" class="btn btn-dark">обновить</button>
        </div>
        <br>

        <div v-if="credits && credits.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <!-- credit list -->

        <template v-for="credit in credits" v-if="credits">
            <div class="card card-body max-w-400px">
                <!-- data -->
                <p>
                    заемщик: {{ credit[1] }} <br>
                    сумма: {{ credit[2] }} <br>  
                    срок: {{ credit[3] }} месяцев <br>
                    погашено: {{ credit[4] }}              
                </p>

                <!-- actions -->
                <router-link :to="`/unions/my/${credit[0]}/repayments`" class="btn btn-outline-dark">
                    погашения
                </router-link>

                <button 
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

        
        <repay-modal :address="address" :creditId="currentCredit"/>

    </div>



</template>
