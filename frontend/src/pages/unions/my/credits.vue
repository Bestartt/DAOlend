<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";
    import { useNotification } from "~/store";


    let address = get_my_union();
    let contract: Contract;
    let credits = ref<any>(null);
    let currentCredit = ref(-1);
    let repayAmount = ref(0);
    let month = ref(0);
    let notif = useNotification();
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getCredits().then(d => credits.value = d);


    }


    async function repay () {
        try {
            await contract.repayCredit(currentCredit.value, repayAmount.value, month.value);
            notif.notify("Транзакция в очереди", "погашение скоро будет в силе")
        }catch (e) {
            console.error("Error occured while calling repay function");
            notif.notify("Произошла ошибка", "не удалось создать транзакцию")
        }
    }

</script>

<template>

    <my-sidebar-wrapper>

        <h4>Кредиты</h4>
        <br>

        <div v-if="credits.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <template v-for="credit in credits">
            <div class="card card-body" max-w-400px>
                <p>
                    заемщик: {{ credit[1] }} <br>
                    сумма: {{ credit[2] }} <br>  
                    срок: {{ credit[3] }} месяцев <br>
                    погашено: {{ credit[4] }}              
                </p>

                <router-link :to="`/unions/my/${credit[0]}/repayments`" class="btn btn-outline-dark">погашения</router-link>
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
    </my-sidebar-wrapper>


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

            <div class="modal-body">
                <label class="form-label" for="month">Месяц</label>
                <input v-model="month" id="month" class="form-control">
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button class="btn btn-dark" data-bs-dismiss="modal" @click="repay()">Отправить</button>
            </div>
            </div>
        </div>
    </div>


</template>
