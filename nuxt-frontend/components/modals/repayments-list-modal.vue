<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    let props = defineProps<{contractAddress: string, creditId: number}>();
    let contract = new Contract(props.contractAddress);

    let { data, pending } = useAsyncData("repayments list", async() => await contract.getRepaymentsByCredit(props.creditId));

</script>


<template>
    <div class="modal fade" id="repayments_list">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Список погашений</h1>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Сумма</th>
                                <th>Месяц</th>
                                <th>Подтверждено</th>
                                <th>.</th>
                            </tr>

                        </thead>

                        <tbody>
                            <tr v-for="repayment in data">
                                <td>{{ repayment.amount }}</td>
                                <td>{{ repayment.month }}</td>
                                <td>{{ repayment.confirmed ? '✅' : '❌' }}</td>
                                <td><button class="btn btn-dark">подтвердить</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
