<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useRouter } from "vue-router";

    let contract_address = ref("");
    let router = useRouter();

    let data = ref<any>(null);
    let not_found = ref(false);
    let has_joined = ref(false);

    let username = ref("");
    let loading = ref(false);
    let joinLoading = ref(false);


    async function find() {
        loading.value = true;
        not_found.value = false;
        data.value = null;

        try {
            let contract = new Contract(contract_address.value);
            data.value = await contract.getData();    

            let members = await contract.getMembers();
            let signer = connection.getSigner();
            let address = await signer.getAddress();

            if (members.some(member => member._address == address)) {
                has_joined.value = true;
            }

        } catch (e) {
            not_found.value = true;
            console.error(e);
        }

        loading.value = false;
    }



    async function callJoin() {
        joinLoading.value = true;
        let contract = new Contract(contract_address.value);

        try {
            await contract.join(username.value);
            join_requests.add({address: contract_address.value, username: username.value})
            router.push("/requests");

        } catch (e) {
            alert("Произошла ошибка или отменена");
        }

        joinLoading.value = false;
        
    }

    onMounted(() => {
        connection.requestMetamask();
    })


</script>

<template>

    <div px-16 class="center">

        <full-loading :loading="joinLoading" />

        <div class="card card-body mt-26 form" v-auto-animate>
            <h3>Найти организацию</h3>

            <!-- input -->
            <div min-w-500px flex gap-3>
                <input v-model="contract_address" class="form-control" placeholder="введите адрес контракта"/>
                <button class="btn btn-dark" @click="find()">найти</button>
            </div>   

            


            <!-- results -->
            <div v-if="data !== null"  class="card card-body mt-5 min-w-500px">

                <h4>{{ data.name }}</h4>
                <p>создатель: {{ data.ownerName }}</p>
            
                <template v-if="has_joined">
                    <b>Вы уже член организации</b>

                    <router-link :to="`/unions/${contract_address}/`" class="btn btn-dark">
                        перейти
                    </router-link>
                </template>

                <button v-else  class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#join">
                    присоединиться
                </button>

            </div>

            <h5 v-if="not_found">Не найдено</h5>    

            <!-- loading -->
            <div class="spinner-border mt-[10%] ms-[50%]" role="status" v-if="loading">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>


        <!-- join modal -->
        <div class="modal fade" id="join">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Создать запрос на вступление</h1>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label" for="quantity">Введите ваше имя</label>
                    <input v-model="username" id="quantity" class="form-control">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button class="btn btn-dark" data-bs-dismiss="modal" @click="callJoin()">Отправить</button>
                </div>
                </div>
            </div>
        </div>            


    </div>

</template>
