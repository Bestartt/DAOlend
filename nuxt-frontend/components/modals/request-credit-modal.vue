<script lang="ts" setup>
    import { Contract } from "~/utils/contract";

    let props = defineProps<{contractAddress: string}>();

    let amount = ref(0);
    let term = ref(0);
    let notif = useNotification();

    let loading = ref(false);
    let contract = new Contract(props.contractAddress);

    async function call() {
        loading.value = true;

        try {
            await contract.createCredit(amount.value, term.value);
            
            notif.notify(
                "Транзакция в очереди", 
                "скоро запрос на кредит будет создан"
            )            
        } catch (e) {
            console.error(e);

            alert("Произошла ошибка или транзакция отменена");
        }

        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">Создать заявку на кредит</h1>
        <hr>

        <p text-gray>
            Кредит будет одобрен если участники имеющие в общем счете больше 60% депозита
            подтвердять эту заявку
        </p>


        <label class="form-label" for="amount">Сумма</label>
        <input v-model="amount" id="amount" class="form-control">

        <label class="form-label" for="term">Срок</label>
        <input v-model="term" id="term" class="form-control">


        <button class="btn btn-dark mt-3"  @click="call()">
            <button-loading :loading="loading">создать</button-loading>
        </button>
      
    </modal>
</template>
