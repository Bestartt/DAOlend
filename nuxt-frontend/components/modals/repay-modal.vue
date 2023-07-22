<script setup lang="ts">
    import { Contract } from "~/utils/contract";

    let props = defineProps<{
        address: string,
        creditId: number,
    }>();

    let repayAmount = ref(0);
    let month = ref(0);
    let loading = ref(false);
    let notif = useNotification();
    

    async function repay () {
        let contract: Contract = new Contract(props.address);
        loading.value = true;

        try {
            await contract.createRepayment(
                props.creditId, 
                repayAmount.value, 
                month.value
            );

            notif.notify("Транзакция в очереди", "погашение скоро будет в создано")
        }catch (e) {
            console.error("Error occured while calling repay function");
            console.error(e);
            notif.notify("Произошла ошибка", "не удалось создать транзакцию или отменена")
        }

        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">Создать погашение</h1>
        <hr>

        <p text-gray>
            После создания другие участники организации должны подтвердить это погашение
        </p>

        <label class="form-label" for="quantity">Сумма</label>
        <input v-model="repayAmount" id="quantity" class="form-control">

        <label class="form-label" for="month">Месяц</label>
        <input v-model="month" id="month" class="form-control">

        <button class="btn btn-dark mt-3" data-bs-dismiss="modal" @click="repay()">
            <button-loading :loading="loading">создать</button-loading>
        </button>

    </modal>           
</template>
