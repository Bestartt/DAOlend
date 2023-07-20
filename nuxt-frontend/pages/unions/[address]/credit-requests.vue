<script setup lang="ts">
    import { useAsyncData } from 'nuxt/app';

    definePageMeta({layout: "union"})

    let route = useRoute();
    
    // @ts-ignore
    let address: string = route.params.address;
    
    let contract = new Contract(address);
    let currentUser = ref("");

    let { data, pending, status, refresh } = useAsyncData(
        "credit requests", 
        async () => await contract.getCredits()
    );

    onMounted(() => {
        // @ts-ignore
        currentUser.value = window.ethereum.selectedAddress;
    })
</script>

<template>
    <div>
        <!-- header -->
        <div flex justify-between>
            <h4>Заявки на кредит</h4>
            <div flex gap-2>
                <button class="btn btn-outline-dark" 
                    data-bs-toggle="modal"
                    data-bs-target="#request_credit">
                    добавить
                </button>
                <button class="btn btn-dark" @click="refresh()">обновить</button>
            </div>   
        </div>

        <!-- loading -->
        <spinner :pending="pending"/>

        <div 
            v-if="status == 'success'" 
            v-auto-animate
        >
            <!-- empty -->
            <div v-if="data && data.length == 0">
                <h2 text-gray>Пусто</h2>
            </div>
            
            
            <!-- card list -->
            <template v-for="credit_request in data">
                <div class="card card-body max-w-400px mt-3">
                    <p>
                        заемщик: {{ credit_request.name }} <br>
                        сумма: {{ credit_request.amount }} <br>
                        срок: {{ credit_request.term }} <br>


                        подтвердившие участники: 
                        <members-list
                            :fetch-key="`credit request members ${address} ${credit_request.id}`"
                            :contract="address"  
                            :members="credit_request.approvedMembers">
                        </members-list>

                        <b text-gray v-if="credit_request.approvedMembers.length == 0">
                            пока нет
                        </b>
                    </p>
                    
                    <!-- buttons -->
                    <button v-if="credit_request.confirmed" disabled class="btn btn-dark">
                        кредит создан
                    </button>

                    <button v-else-if="currentUser !== credit_request.member.toLocaleLowerCase()"
                        @click="approve(credit_request[0], address)" 
                        class="btn btn-dark">подтвердить
                    </button>


                </div>
            </template>             
        </div>

         <request-credit-modal :contract-address="address"/>  
    </div>
</template>
