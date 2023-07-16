<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;
    let approveLoading = ref(false);
    let notif = useNotification();
    let contract: Contract = new Contract(address);
    
    let { data, pending, refresh, error, status } = useAsyncData("deposits", async () => {
        let deposits = await contract.getDeposits();
        deposits = to_mutable(deposits);

        for (let i = 0; i < deposits.length; i++) {
            // @ts-ignore
            deposits[i].members = await contract.getMembersByAddresses(deposits[i].approvedMembers);
        }
        return deposits;
    });

    async function confirm(id: number){
        approveLoading.value = true;
        await contract.approveDeposit(id);
        approveLoading.value = false;

        notif.notify("Транзакция скоро выполниться", "Подтверждение депозита отправлена успешно")
    }

    watch(status, () => {
        if (status.value == "error") {
            console.log(error.value);
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
                        подтвержден: {{ deposit.confirmed ? "✅" : "❌" }}  
                    </p>

                    <b>Подтвердившие участники</b>
                    <ul v-auto-animate>
                        <li v-for="member in deposit.members">
                            {{ member.name }}
                        </li>
                    </ul>

                    <template v-if="!deposit.confirmed">
                        <hr>
                        <button class="btn btn-dark" @click="confirm(index)">
                            <button-loading :loading="approveLoading">
                                подтвердить
                            </button-loading>
                        </button>

                    </template>
                </div>
            </template>

        </div>
        
    </div>
</template>

