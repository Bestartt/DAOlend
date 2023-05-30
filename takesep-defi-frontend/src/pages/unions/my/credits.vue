<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";


    let address = get_my_union();
    let contract: Contract;
    let data = ref<any>(null);
    let currentCredit = ref(-1);
    let repayAmount = ref(0);
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getCredits().then(d => data.value = d);
    }


    async function repay () {
        try {
            await contract.repayCredit(currentCredit.value, repayAmount.value);
        }catch (e) {
            console.error("Error occured while calling repay function");
            alert("Ошибка")
        }
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
                    заемщик: {{ credit[1] }} <br>
                    сумма: {{ credit[2] }} <br>  
                    погашено: {{ credit[3] }}              
                </p>


                <button 
                    data-bs-toggle="modal"
                    data-bs-target="#repay"
                    @click="currentCredit = credit[0]" 
                    class="btn btn-dark" 
                    max-w-200px>
                    Создать погашение
                </button>

            </div>
        </template>


    </div>


    <div class="modal fade" id="repay">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Добавить погашение</h1>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <label class="form-label" for="quantity">Сумма</label>
                <input v-model="repayAmount" id="quantity" class="form-control">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button class="btn btn-dark" data-bs-dismiss="modal" @click="repay()">Отправить</button>
            </div>
            </div>
        </div>
    </div>

</template>
