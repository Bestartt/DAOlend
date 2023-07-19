<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string, my: boolean}>();
    let address = props.address;
    let contract: Contract = new Contract(address);

    let currentCredit = ref(-1);
    let userAddress = ref(connection.getCurrentUserAddress());
    let unionUrl = props.my ? "my" : address;

    let { data, pending, refresh } = useAsyncData(
        "credits",
        async () => (await contract.getCredits()).filter(c => c.confirmed)
    );


</script>

<template>
    <div>
        <!-- head -->
        <div flex justify-between>
            <h4>Кредиты</h4>
            <button @click="refresh()" class="btn btn-dark">обновить</button>
        </div>
        <br>

        <!-- loading -->
        <spinner :pending="pending"/>

        <!-- empty -->
        <div v-if="data && data.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <!-- credit list -->

        <div v-if="!pending" v-auto-animate>
            <template v-for="credit in data">
                <div class="card max-w-500px">
                    <h5 class="card-header">
                        <b>заемщик: {{ credit.name }}</b>
                    </h5>

                    <!-- data -->
                    <div class="card-body">
                        сумма: {{ credit.amount }} <br>  
                        срок: {{ credit.term }} месяцев <br>
                        погашено: {{ credit.repaid }} <br>
                        <br>

                        <!-- actions -->                        
                        <nuxt-link prefetch :to="`/unions/${unionUrl}/repayments/${credit.id}/`" 
                            class="btn btn-outline-dark me-1"
                        >
                            погашения
                        </nuxt-link>

                    </div>
                </div>
            </template> 
        </div>
    

        <repay-modal :address="address" :creditId="currentCredit"/>

    </div>
</template>
