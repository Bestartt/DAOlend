<script lang="ts" setup>
    import { useAsyncData, useRouter } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();
    // @ts-ignore
    let address: string = route.params.address; let creditId: string = route.params.id;

    let modal = useModal();
    let user = ref("");
    let contract = new Contract(address);
    let currentRepayment = ref(-1);


    let { data, pending, status, refresh } = useAsyncData(
        async () => await contract.getRepaymentsByCredit(Number.parseInt(creditId))
    )

    let { data: credit, status: creditStatus } = useAsyncData(
        async () => await contract.getCredit(Number.parseInt(creditId))
    )

    let { data: members, status: membersStatus } = useAsyncData(
        async() => await contract.getMembers()
    );

    async function approve(id: number) {
        await contract.approveRepayment(id);
    }

    onMounted(() => {
        // @ts-ignore
        user.value = window.ethereum.selectedAddress;
    })

</script>


<template>
    <div>
        <div flex justify-between>
            <h4>Credit repayments</h4>

            <div>
                <template v-if="creditStatus == 'success' && credit.member.toLowerCase() == user">
                    <button class="btn btn-outline-dark me-2" @click="currentRepayment = -1; modal.open()">
                        create
                    </button>
                </template>

                <button class="btn btn-dark" @click="refresh()">
                    refresh
                </button>
            </div>
        </div>
        

        <div class="card card-body mt-3" v-auto-animate>
            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <table class="table table-hover table-bordered" v-if="status == 'success' && membersStatus == 'success'">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>month</th>
                        <th>amount</th>
                        <th>approved</th>
                        <th>created at</th>
                        <th>approved members</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="(repayment, index) in data">
                        <td>{{ repayment.id }}</td>
                        <td>{{ repayment.month }}</td>
                        <td>{{ repayment.amount }}</td>
                        <!-- confirmed members -->
                        <td>
                            {{ repayment.confirmed ? '✅' : '❌' }}
                            {{ repayment.approvedMembers.length }} / {{ members.length - 1 }}
                        </td>

                        <!-- created date -->
                        <td>{{ new Date(repayment.createdAt.toNumber()).toLocaleDateString("ru") }}</td>
                        
                        <!-- members list -->
                        <td>
                            <a href="#" class="dark-link" @click="currentRepayment = index; modal.open();">список</a>
                        </td>

                        <!-- actions -->
                        <template v-if="user !== repayment.creator.toLocaleLowerCase()">
                            <td>
                                <button class="btn btn-dark" 
                                    v-if="repayment.approvedMembers.some(m => m.toLowerCase() == user)" 
                                    disabled
                                >
                                    you have approved
                                </button>
                                <button class="btn btn-dark btn-sm" v-else @click="approve(repayment.id)"> approve</button>
                            </td>
                        </template>
                            
                    </tr>
                </tbody>
            </table>              
        </div>


        <template v-if="currentRepayment !== -1">
            <members-list-modal :members="data[currentRepayment].approvedMembers" :contract="address">
                <h5>The list of the approved members</h5>
                <hr>
            </members-list-modal>    
        </template>

        <template v-if="currentRepayment === -1">
            <repay-modal :address="address" :credit-id="Number(creditId)"></repay-modal>
        </template>

    </div>
</template>
