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

            notif.notify("The transaction will be completed soon", "The repayment will be created soon");   
        }catch (e) {
            console.error("Error occured while calling repay function");
            console.error(e);
            alert("Canceled or error. Make sure that you have logged to Metamask");
        }

        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">Create repayment</h1>
        <hr>

        <p text-gray>
            After creation other members should approve this repayment
        </p>

        <label class="form-label" for="quantity">Amount</label>
        <input v-model="repayAmount" id="quantity" class="form-control">

        <label class="form-label" for="month">Month</label>
        <input v-model="month" id="month" class="form-control">

        <button class="btn btn-dark mt-3" data-bs-dismiss="modal" @click="repay()">
            <button-loading :loading="loading">create</button-loading>
        </button>

    </modal>           
</template>
