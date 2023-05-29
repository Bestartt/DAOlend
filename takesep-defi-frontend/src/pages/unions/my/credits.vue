<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";


    let address = get_my_union();
    let contract: Contract;
    let data = ref<any>(null);
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getCredits().then(d => data.value = d);
    }


    function repay () {

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
        
        <h3 mt-5>Организация: {{ data.name }}</h3>

        <my-union-menu></my-union-menu>

        <br>

        <h4>Кредиты</h4>

        <template v-for="credit in data">
            <div class="card card-body" max-w-500px>
                <p>
                    заемщик: {{ credit[0] }} <br>
                    сумма: {{ credit[1] }} <br>  
                    погашено: {{ credit[2] }}              
                </p>


                <button @click="repay()" class="btn btn-dark" max-w-200px>Создать погашение</button>

            </div>
        </template>


    </div>

</template>