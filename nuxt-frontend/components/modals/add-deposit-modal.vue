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
            notification.notify("The transaction will be completed soon", "Soon will be in the list of deposits");            
        } catch (e) {
            alert("Canceled or error. Make sure that you have logged to Metamask");
        }
        loading.value = false;
    }

</script>


<template>
    <modal>
        <h1 class="modal-title fs-5">
            Create deposit
        </h1>
        <hr>

        <p text-gray>
            After creation other members should approve this deposit
        </p>

        <label class="form-label" for="quantity">Enter amount of the deposit</label>
        <input v-model="quantity" id="quantity" class="form-control">

        <button class="btn btn-dark mt-3"  @click="call()">
            <button-loading :loading="loading">create</button-loading>
        </button>
      
    </modal>
</template>


