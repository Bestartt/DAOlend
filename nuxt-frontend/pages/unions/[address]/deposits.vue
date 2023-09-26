<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();

    // @ts-ignore
    let address: string = route.params.address;
    let notif = useNotification();

    let contract: Contract = new Contract(address);
    
    let approveLoading = ref(false);
    let currentUser = ref("");
    let modal = useModal();

    let { data, pending, refresh, status } = useAsyncData("deposits", async () => await contract.getDeposits());

    async function confirm(id: number){
        approveLoading.value = true;
        try {
            await contract.approveDeposit(id);
            notif.notify("The transaction will be completed soon", "Deposit approval sent successfully")
        } catch(e) {
            console.error(e);
            alert("Canceled or error. Make sure that you have logged to Metamask");
        }
        approveLoading.value = false;
    }

    onMounted(() => {
        // @ts-ignore
        currentUser.value = window.ethereum.selectedAddress;
    })

</script>

<template>
    <div>
        <!-- head -->
        <div flex justify-between>
            <h4>Deposits</h4>

            <div>
                <button @click="modal.open()"  class="btn btn-outline-dark me-1" >add</button>
                <button @click="refresh()" class="btn btn-dark">refresh</button>
            </div>
        </div>
        <br>

        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 

        <!-- empty -->
        <div v-if="data && data.length == 0 && !pending">
            <h2 text-gray>Empty</h2>
        </div>

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <!-- deposit list -->

        <div v-if="!pending && data !== null" v-auto-animate>
            <template v-for="(deposit, index) in data">
                <div class="card max-w-500px mt-2">
                    <!-- card header -->
                    <div class="card-header"><b>member: {{ deposit.name }}</b></div>

                    <!-- info -->
                    <div class="card-body py-2 pb-0">
                        amount: {{ deposit.amount }} <br>
                        approved: {{ deposit.confirmed ? "✅" : "❌" }}  
                    </div>
                    <hr>

                    <div class="card-body py-0 pb-3">
                        <b>Approved members</b>
                        <members-list 
                            :members="deposit.approvedMembers" 
                            :contract="address" 
                        />
    
                        <!-- actions -->

                        <template v-if="!deposit.confirmed && deposit.member.toLowerCase() !== currentUser">

                            <button class="btn btn-dark" 
                                v-if="!deposit.approvedMembers.some(m => m.toLowerCase() == currentUser)" 
                                @click="confirm(index)"
                            >
                                <button-loading :loading="approveLoading">
                                    approve
                                </button-loading>
                            </button>

                            <button class="btn btn-dark" disabled v-else>
                                you already have approved
                            </button>
                        </template>

    
                    </div>

                </div>
            </template>

        </div>
        
        <add-deposit-modal 
            :contract-address="address" 
        />  
    </div>
</template>

