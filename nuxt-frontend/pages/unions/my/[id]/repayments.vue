<script setup lang="ts">
    import { Contract } from "~/utils/contract";

    let route = useRoute();

    let address = get_my_union();
    let contract: Contract;
    let repayments = ref<any>(null);

    
    if (address != null) {
        contract = new Contract(address);
        // @ts-ignore
        contract.getRepaymentsByCredit(route.params.id).then(d => repayments.value = d);


    }


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
