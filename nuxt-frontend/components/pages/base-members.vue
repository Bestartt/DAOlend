<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    
    let props = defineProps<{address: string}>();
    let address = props.address;

    let contract: Contract = new Contract(address);

    let { data: members, pending, refresh: refresh } = useAsyncData(async () => await contract.getMembers());

    let totalDeposit = computed(() => {
        let sum = 0;
        members.value.map(member => sum += member[0]);
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
                обновить
            </button>
        </div>
        
        <span text-gray>и их вложения</span>

        <br>

        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <div class="card card-body max-w-800px mt-3" v-else>
            <table class="table table-hover min-w-400px">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Вложение</th>
                        <th>Процент вложения</th>
                        <th>Адрес</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="member in members">
                        <td>{{ member[2] }}</td>
                        <td>{{ member[0] }}</td>
                        <td>{{ getPercent(member[0]) }}%</td>
                        <td>{{ member[3] }}</td>
                    </tr>
                </tbody>
            </table>              
        </div>
         
    </div>
     


</template>
