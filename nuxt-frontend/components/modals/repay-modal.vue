<script setup lang="ts">
    import { Contract } from "~/utils/contract";

    let props = defineProps<{
        address: string,
        creditId: number
    }>();

    let repayAmount = ref(0);
    let month = ref(0);

    let notif = useNotification();
    

    async function repay () {
        let contract: Contract = new Contract(props.address);

        try {
            await contract.createRepayment(
                props.creditId, 
                repayAmount.value, 
                month.value
            );

            notif.notify("Транзакция в очереди", "погашение скоро будет в силе")
        }catch (e) {
            console.error("Error occured while calling repay function");
            notif.notify("Произошла ошибка", "не удалось создать транзакцию")
        }
    }

</script>


<template>
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
