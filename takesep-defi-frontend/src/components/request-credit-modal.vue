<script lang="ts" setup>
    import { Contract } from '~/crypto';

    let contractAddress = defineProp<string>("contractAddress");
    let onComplete = defineEmit("onComplete")

    let amount = ref(0);
    let debtor = ref("");
    let term = ref(0);

    let loading = ref(false);
    let contract = new Contract(contractAddress.value);

    async function call() {
        loading.value = true;
        await contract.createCreditRequest(amount.value, term.value, debtor.value);
        
        onComplete();

    }

</script>


<template>
    <div class="modal fade" id="request_credit">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Создать запрос на кредит</h1>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <label class="form-label" for="amount">Сумма</label>
                <input v-model="amount" id="amount" class="form-control">

                <label class="form-label" for="term">Срок</label>
                <input v-model="term" id="term" class="form-control">

                <label class="form-label" for="debtor">Имя заемщика</label>
                <input v-model="debtor" id="debtor" class="form-control">  
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button class="btn btn-dark" data-bs-dismiss="modal" @click="call()">Отправить</button>
            </div>
            </div>
        </div>
    </div>
</template>
