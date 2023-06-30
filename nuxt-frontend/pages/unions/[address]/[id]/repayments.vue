<script setup lang="ts">
    import { Contract } from "~/utils/crypto";

    let route = useRoute();
    let address = route.params.address;

    let contract: Contract;
    let repayments = ref<any>([]);

    
    onMounted(async() => {
        contract = new Contract(address);
        repayments.value = await contract.getRepaymentsByCredit(route.params.id);
    }) 
</script>


<template>
    <div>
        <h4>Погашения</h4>

        <table class="table table-striped" min-w-400px max-w-800px mt-5>
            <thead>
                <tr>
                    <th>Месяц</th>
                    <th>Сумма</th>
                </tr>
            </thead>

            <tbody>

                <tr v-for="repayment in repayments">
                    <td>{{ repayment[0] }}</td>
                    <td>{{ repayment[1] }}</td>
                </tr>
            </tbody>
        </table>   

    </div>
</template>
