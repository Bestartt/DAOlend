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
                "The transaction will be completed soon", 
                "The join application will be created soon"
            )            
        } catch (e) {
            console.error(e);
            alert("Canceled or error. Make sure that you have logged to Metamask");
        }

        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">Create loan application</h1>
        <hr>

        <p text-gray>
            The loan (credit) will be approved if more than 60% of deposit weight of members approve
        </p>


        <label class="form-label" for="amount">amount</label>
        <input v-model="amount" id="amount" class="form-control">

        <label class="form-label" for="term">Срок</label>
        <input v-model="term" id="term" class="form-control">


        <button class="btn btn-dark mt-3"  @click="call()">
            <button-loading :loading="loading">create</button-loading>
        </button>
      
    </modal>
</template>
