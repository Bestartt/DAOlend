
<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();
    // @ts-ignore
    let address: string = route.params.address;
    let contract: Contract = new Contract(address);

    let currentCredit = ref(-1);
    let modalOpen = ref(false);

    let { data, pending, refresh, status } = useAsyncData(
        "credits",
        async () => (await contract.getCredits()).filter(c => c.confirmed)
    );


</script>

<template>
    <div>
        <!-- head -->
        <div flex justify-between>
            <h4>Credits</h4>
            <button @click="refresh()" class="btn btn-dark">refresh</button>
        </div>
        <br>

        <!-- loading -->
        <spinner :pending="pending"/>

        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 

        <!-- empty -->
        <div v-if="data && data.length == 0">
            <h2 text-gray>Empty</h2>
        </div>

        <!-- credit list -->

        <div v-if="!pending" v-auto-animate>
            <template v-for="credit in data">
                <div class="card max-w-500px">
                    <h5 class="card-header">
                        <b>borrower: {{ credit.name }}</b>
                    </h5>

                    <!-- data -->
                    <div class="card-body">
                        amount: {{ credit.amount }} <br>  
                        term: {{ credit.term }} months <br>
                        repaid: {{ credit.repaid }} <br>

                        <b v-if="credit.amount <= credit.repaid" my-2>Credit is fully repaid ✅</b>

                        <br>

                        <!-- actions -->                        
                        <nuxt-link prefetch :to="`/unions/${address}/repayments/${credit.id}/`" 
                            class="btn btn-outline-dark me-1 mt-3"
                        >
                            repayments
                        </nuxt-link>

                    </div>
                </div>
            </template> 
        </div>
    

        <repay-modal :address="address" :creditId="currentCredit" :is-open="modalOpen"/>

    </div>
</template>
