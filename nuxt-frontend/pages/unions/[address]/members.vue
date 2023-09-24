<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"});

    let route = useRoute();
    // @ts-ignore
    let address: string = route.params.address;

    let contract: Contract = new Contract(address);

    let { data, pending, refresh } = useAsyncData("members", async () => {
        let members = await contract.getMembers();
        return members.filter(m => m.confirmed);
    });

    let totalDeposit = computed(() => {
        let sum = 0;
        data.value.map(member => sum += member.contribution);
        return sum;
    });

    function getPercent(deposit: number) {
        let result = Math.floor(deposit / (totalDeposit.value / 100));
    
        return Number.isNaN(result) ? 0 : result;
    }

</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Участники организации</h4>

            <button class="btn btn-dark" @click="refresh()">
                refresh
            </button>
        </div>
        
        <span text-gray>и их вложения</span>
        <br>

        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 

        <div class="card card-body mt-3" v-auto-animate>
            <h4>Таблица участников</h4>

            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <table class="table table-hover table-bordered" v-else>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Вложение</th>
                        <th>Процент вложения</th>
                        <th>Дата вступления</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="member in data">
                        <td>
                            <nuxt-link 
                                class="dark-link"
                                :to="`/unions/${address}/${member.member}/member-detail`">
                                {{ member.name }}
                            </nuxt-link>
                        </td>
                        <td>{{ member.contribution }}</td>
                        <td>{{ getPercent(member.contribution) }}%</td>
                        <td>{{ new Date(member.joinedAt.toNumber()).toLocaleString("ru") }}</td>
                    </tr>
                </tbody>
            </table>              
        </div>
         
    </div>
     


</template>
