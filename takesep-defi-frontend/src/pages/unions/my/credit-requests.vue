<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";


    let address = get_my_union();
    let data = ref<any>(null);
    
    
    if (address != null) {
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

    <div v-if="address == null">
        <h3>
            У вас нет организации. 
        </h3>

        <router-link to="/create-union">создать</router-link>
    </div>

    <div v-if="data != null">
        
        <h3 mt-5>Заявки на кредит</h3>

        <my-union-menu></my-union-menu>

        <br>

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


    </div>

</template>
