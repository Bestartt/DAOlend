<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();
    
    // @ts-ignore
    let address: string = route.params.address;

    let contract: Contract = new Contract(address);

    let { data, pending, error, refresh, status } = useAsyncData("my union data", async () => await contract.getData());

    let { data: info, pending: infoPending } = useAsyncData(async() => {
        return {
            credits: await contract.getCredits(),
            deposits: await contract.getDeposits(),
            members: await contract.getMembers()
        }
    });

    watch(status, () => {
        if (status.value == "error") {
            console.log(error.value);
        }
    })

</script>

<template>
    <div>
        <!-- header -->
        <div flex justify-between>
            <h4>Main info</h4>
            <button @click="refresh()" class="btn btn-dark">refresh</button>
        </div>

        <!-- error -->
        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b>   

        <!-- card -->
        <div class="card card-body mt-3 px-4 py-4" v-auto-animate>

            <!-- loading -->
            <div class="w-full h-10vh flex justify-center items-center" v-if="pending || infoPending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <!-- base info -->
            <div class="block" v-if="data !== null && !pending">
                <span text-gray>organization</span>
                <h2>{{ data.name }}</h2>
                <br>

                <dl class="row">
                    <dt class="col-sm-2">creator:</dt>
                    <dd class="col-sm-10">{{ data.ownerName }}</dd>

                    <dt class="col-sm-2">created at: </dt>
                    <dd class="col-sm-10">{{ new Date(data.createdAt).toLocaleString("ru") }}</dd>

                    <dt class="col-sm-2">address:</dt>
                    <dd class="col-sm-10">{{ address }}</dd>

                </dl>
            </div>

            <hr>

            <!-- options -->
            <div class="row g-4 px-3 row-cols-1 row-cols-lg-3 text-center" v-if="info !== null && data !== null && !infoPending">
                <!-- credits -->
                <div class="feature col block">
                    <h4>Credits</h4>
                    total: <b>{{ info.credits.length }}</b> <br>
                    applications: <b>{{ info.credits.filter(c => !c.confirmed).length }}</b> <br>
                    given: <b>{{ info.credits.filter(c => c.confirmed).reduce((a, c) => a + c.amount, 0) }}</b>
                    
                    <br>
                    <nuxt-link prefetch :to="`/unions/${address}/credits/`" class="btn btn-dark mt-3">
                        go to
                    </nuxt-link>
                </div>

                <!-- deposits -->
                <div class="feature col">
                    <h4>Deposits</h4>
                    total deposit: <b>{{ data.totalDeposit }}</b> <br>
                    number if deposits: {{ info.deposits.length }}
                    <br><br>
                    <nuxt-link prefetch :to="`/unions/${address}/deposits/`" class="btn btn-dark mt-3">
                        go to
                    </nuxt-link>
                </div>

                <!-- members -->
                <div class="feature col">
                    <h4>Members</h4>
                    total: <b>{{ info.members.filter(m => m.confirmed).length }}</b> <br>
                    join applications: <b>{{ info.members.filter(m => !m.confirmed).length }}</b>
                    <br><br>
                    <nuxt-link prefetch :to="`/unions/${address}/members/`" class="btn btn-dark mt-3">
                        go to
                    </nuxt-link>
                </div>
            </div>  
        </div>
    </div>


</template>
