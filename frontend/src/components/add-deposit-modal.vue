<script lang="ts" setup>
    import { Contract } from '~/crypto';
    import { useNotification } from '~/store';

    let contractAddress = defineProp<string>("contractAddress");
    let onComplete = defineEmit("onComplete")

    let quantity = ref(0);
    let contract = new Contract(contractAddress.value);
    let notification = useNotification();

    async function callAddDeposit() {
        await contract.deposit(quantity.value);
        
        notification.notify("Транзакция в очереди", "Скоро депозит пополниться");
        onComplete();
    }

</script>


<template>
    <div class="modal fade" id="add_deposit">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Добавить вложение</h1>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <label class="form-label" for="quantity">Введите значение</label>
                <input v-model="quantity" id="quantity" class="form-control">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button class="btn btn-dark" data-bs-dismiss="modal" @click="callAddDeposit()">Отправить</button>
            </div>
            </div>
        </div>
    </div>
</template>


