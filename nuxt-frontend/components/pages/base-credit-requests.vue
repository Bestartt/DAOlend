<script setup lang="ts">
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;

    let { data, pending, refresh } = useAsyncData("credit requests", async () => await getCreditRequests(address));

</script>

<template>
    <div>
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
        <br>


        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <template v-else>
            <div v-if="data && data.length == 0">
                <h2 text-gray>Пусто</h2>
            </div>

            <template v-for="credit_request in data">
                <div class="card card-body" max-w-400px mt-3>
                    <p>
                        заемщик: {{ credit_request.deptor }} <br>
                        сумма: {{ credit_request.amount }} <br>
                        срок: {{ credit_request.term }} <br>
                        подтвердившие участники: 
                        <ol>
                            <li v-for="memberName in credit_request.members">
                                {{ memberName }}
                            </li>
                        </ol>               

                    </p>

                    <button v-if="credit_request.creditCreated" disabled class="btn btn-dark">
                        кредит создан
                    </button>

                    <button v-else
                        @click="approve(credit_request[0], address)" 
                        class="btn btn-dark">подтвердить
                    </button>


                </div>
            </template>             
        </template>

         <request-credit-modal :contract-address="address" @on-complete="updateData()"/>  
    </div>
</template>
