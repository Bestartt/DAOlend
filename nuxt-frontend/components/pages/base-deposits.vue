<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;
    
    let contract: Contract = new Contract(address);
    
    let { data, pending, refresh, error, status } = useAsyncData("deposits", async () => contract.getDeposits());

    watch(status, () => {
        if (status.value == "error") {
            console.error(error.value);
        }
    })

</script>

<template>
    <div>
        <!-- head -->

        <div flex justify-between>
            <h4>Вложения</h4>
            <button @click="refresh()" class="btn btn-dark">обновить</button>
        </div>
        <br>

        <div v-if="data && data.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <!-- deposit list -->

        <div v-if="!pending" v-auto-animate>
            <template v-for="(deposit, index) in data">
                <div class="card card-body max-w-400px">
                    <!-- data -->
                    <p>
                        участник: {{ deposit.name }} <br>
                        сумма: {{ deposit.amount }} <br>
                        подтвержден: {{ deposit.confirmed ? "❌" : "✅" }}  
                    </p>

                    <hr>

                    <button 
                        class="btn btn-dark" 
                        data-bs-toggle="modal" 
                        :data-bs-target="`#approved_members_${index}`"> 
                        подтвердившие участники
                    </button>
 

                </div>
            </template>

            <!-- <approved-members :member-addresses="deposit.approvedMembers" :index="index"></approved-members> -->
        </div>
        
    </div>
</template>

