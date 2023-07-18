<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    let route = useRoute();

    let address = my_union.get();
    let contract: Contract = new Contract(address);
    
    let { data, pending } = useAsyncData(async () => await contract.getRepaymentsByCredit(route.params.id));

</script>


<template>
    <div py-5>
        <h4>Погашения</h4>

        <div class="card card-body">
            <table class="table table-striped" min-w-400px mt-5>
                <thead>
                    <tr>
                        <th>Месяц</th>
                        <th>Сумма</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="repayment in data">
                        <td>{{ repayment[0] }}</td>
                        <td>{{ repayment[1] }}</td>
                    </tr>
                </tbody>
            </table>              
        </div>
 

    </div>
</template>
