<script setup lang="ts">
    import { Contract } from "~/utils/crypto";


    let route = useRoute();
    let address = route.params.address;

    let data = ref<any>(null);
    
    
    if (address != null) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.getCreditRequests().then(d => data.value = d);
    }

    function approve(id) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.approveCreditRequest(id)
    }


</script>

<template>

    <sidebar-wrapper>
        <template v-for="credit_request in data">
            <div class="card card-body" max-w-500px>
                <p>
                    заемщик: {{ credit_request[1] }} <br>
                    сумма: {{ credit_request[2] }} <br>
                    подтвержденные члены: {{ credit_request[3] }}                    
                </p>


                <button @click="approve(credit_request[0])" class="btn btn-dark" max-w-200px>подтвердить</button>

            </div>
        </template>        
    </sidebar-wrapper>

</template>
