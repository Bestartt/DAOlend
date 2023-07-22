<script lang="ts" setup>
    import { Contract } from "~/utils/contract";

    let props = defineProps<{contractAddress: string}>();
    let quantity = ref(0);
    let contract = new Contract(props.contractAddress);
    let notification = useNotification();
    let loading = ref(false);

    async function call() {
        loading.value = true;
        try {
            await contract.createDeposit(quantity.value);
            notification.notify("Транзакция в очереди", "Скоро появится в списке депозитов");            
        } catch (e) {
            notification.notify("Произошла ошибка или отменена");   
        }
        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">
            Создать депозит
        </h1>
        <hr>

        <p text-gray>
            После создания другие участники организации должны подтвердить этот депозит
        </p>

        <label class="form-label" for="quantity">Введите сумму депозита</label>
        <input v-model="quantity" id="quantity" class="form-control">

        <button class="btn btn-dark mt-3"  @click="call()">
            <button-loading :loading="loading">создать</button-loading>
        </button>
      
    </modal>
</template>


