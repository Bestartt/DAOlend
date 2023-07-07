<script setup lang="ts">


    let props = defineProps<{address: string}>();
    let address = props.address;

    let credit_requests = ref<any>([]);

    async function updateData() {
        credit_requests.value = await getCreditRequests(address);
    }

    onMounted(updateData)

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
                <button class="btn btn-dark" @click="updateData()">обновить</button>
            </div>
            
        </div>
        <br>

        <div v-if="credit_requests.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        <template v-for="credit_request in credit_requests">
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

                
                <button
                    @click="approve(credit_request[0], address)" 
                    class="btn btn-dark">подтвердить
                </button>


            </div>
        </template>          
    </div>
      
    <request-credit-modal :contract-address="address" @on-complete="updateData()"/>  
</template>
