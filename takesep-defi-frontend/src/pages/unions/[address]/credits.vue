<script setup lang="ts">
    import { Contract } from "~/crypto";


    let route = useRoute();
    let address = route.params.address;
    let contract: Contract;

    let data = ref<any>(null);
    
    // @ts-ignore
    contract = new Contract(address);
    contract.getCredits().then(d => data.value = d);


</script>

<template>

    <sidebar-wrapper>
        <div v-if="data.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        <template v-for="credit in data">
            <div class="card card-body" max-w-500px>
                <p>
                    заемщик: {{ credit[1] }} <br>
                    сумма: {{ credit[2] }} <br>  
                    погашено: {{ credit[3] }}              
                </p>

            </div>
        </template>        
    </sidebar-wrapper>


</template>
