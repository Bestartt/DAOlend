<script setup lang="ts">
    import { Contract } from "~/utils/crypto";

    definePageMeta({layout: "union"})

    let route = useRoute();
    let address = route.params.address;
    let contract: Contract;

    let credits = ref<any>([]);
    
    // @ts-ignore
    contract = new Contract(address);
    contract.getCredits().then(d => credits.value = d);


</script>

<template>

    <div>
        <h4>Кредиты</h4>
        <br>
        
        <div v-if="credits.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        <template v-for="credit in credits" v-if="credits">
            <div class="card card-body" max-w-400px>
                <p>
                    заемщик: {{ credit[1] }} <br>
                    сумма: {{ credit[2] }} <br>  
                    срок: {{ credit[3] }} месяцев <br>
                    погашено: {{ credit[4] }}              
                </p>

                <router-link :to="`/unions/${address}/${credit[0]}/repayments`" class="btn btn-outline-dark">погашения</router-link>

            </div>
        </template>          
    </div>


</template>
