<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();

    // @ts-ignore
    let address: string = route.params.address;
    let notif = useNotification();

    let contract: Contract = new Contract(address);
    
    let approveLoading = ref(false);
    let currentUser = ref("");
    let modalOpen = ref(false);

    let { data, pending, refresh } = useAsyncData("deposits", async () => await contract.getDeposits());

    async function confirm(id: number){
        approveLoading.value = true;
        try {
            await contract.approveDeposit(id);
            notif.notify("Транзакция скоро выполниться", "Подтверждение депозита отправлена успешно")
        } catch(e) {
            console.error(e);
            notif.notify("Ошибка или операция отменена");
        }
        approveLoading.value = false;
    }

    onMounted(() => {
        // @ts-ignore
        currentUser.value = window.ethereum.selectedAddress;
    })

</script>

<template>
    <div>
        <!-- head -->
        <div flex justify-between>
            <h4>Депозиты</h4>

            <div>
                <button @click="modalOpen = true"  class="btn btn-outline-dark me-1" > Добавить</button>
                <button @click="refresh()" class="btn btn-dark">обновить</button>
            </div>
        </div>
        <br>

        <!-- empty -->
        <div v-if="data && data.length == 0">
            <h2 text-gray>Пусто</h2>
        </div>

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <!-- deposit list -->

        <div v-if="!pending && data !== null" v-auto-animate>
            <template v-for="(deposit, index) in data">
                <div class="card max-w-500px mt-2">
                    <!-- card header -->
                    <div class="card-header"><b>участник: {{ deposit.name }}</b></div>

                    <!-- info -->
                    <div class="card-body py-2 pb-0">
                        сумма: {{ deposit.amount }} <br>
                        подтвержден: {{ deposit.confirmed ? "✅" : "❌" }}  
                    </div>
                    <hr>

                    <div class="card-body py-0 pb-3">
                        <!-- approved members -->
                        <b>Подтвердившие участники</b>
                        <members-list 
                            :members="deposit.approvedMembers" 
                            :contract="address" 
                            :fetch-key="`deposit-approved-members-${index}`"
                        />
    
                        <!-- actions -->

                        <template v-if="!deposit.confirmed && deposit.member.toLowerCase() !== currentUser">

                            <button class="btn btn-dark" 
                                v-if="!deposit.approvedMembers.some(m => m.toLowerCase() == currentUser)" 
                                @click="confirm(index)"
                            >
                                <button-loading :loading="approveLoading">
                                    подтвердить
                                </button-loading>
                            </button>

                            <button class="btn btn-dark" disabled v-else>
                                вы подтвердили
                            </button>
                        </template>

    
                    </div>

                </div>
            </template>

        </div>
        
        <add-deposit-modal 
            :contract-address="address" 
            :is-open="modalOpen" 
            @on-close="modalOpen = false"
        />  
    </div>
</template>

