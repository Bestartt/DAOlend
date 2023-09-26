<script setup lang="ts">
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();
    let modal = useModal();

    // @ts-ignore
    let address: string = route.params.address;
    
    let contract = new Contract(address);
    let currentUser = ref("");

    let { data, pending, status, refresh } = useAsyncData(
        "credit requests", 
        async () => await contract.getCredits()
    );

    onMounted(() => {
        // @ts-ignore
        currentUser.value = window.ethereum.selectedAddress;
    })
</script>

<template>
    <div>
        <!-- header -->
        <div flex justify-between>
            <h4>Loan applications</h4>
            <div flex gap-2>
                <button class="btn btn-outline-dark" @click="modal.open()">
                    add
                </button>
                <button class="btn btn-dark" @click="refresh()">refresh</button>
            </div>   
        </div>

                <!-- error -->
        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b>   

        <!-- loading -->
        <spinner :pending="pending"/>

        <div 
            v-if="status == 'success'" 
            v-auto-animate
        >
            <!-- empty -->
            <div v-if="data && data.length == 0">
                <h2 text-gray>Empty</h2>
            </div>
            
            
            <!-- card list -->
            <template v-for="credit_request in data">
                <div class="card max-w-400px mt-3">
                    <div class="card-header">
                        <b>borrower: {{ credit_request.name }}</b>
                    </div>

                    <div class="card-body">
                        <p>
                            amount: {{ credit_request.amount }} <br>
                            term: {{ credit_request.term }} <br>


                            approved members: 
                            <members-list
                                :contract="address"  
                                :members="credit_request.approvedMembers">
                            </members-list>

                        </p>
                        
                        <!-- buttons -->
                        <button v-if="credit_request.confirmed" disabled class="btn btn-dark">
                            credit has been created
                        </button>

                        <button v-else-if="currentUser !== credit_request.member.toLocaleLowerCase()"
                            @click="approve(credit_request[0], address)" 
                            class="btn btn-dark">approve
                        </button>                        
                    </div>



                </div>
            </template>             
        </div>

         <request-credit-modal :contract-address="address"/>  
         
    </div>
</template>
