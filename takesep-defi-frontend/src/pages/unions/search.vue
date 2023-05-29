<script setup lang="ts">
    import { Contract } from "~/crypto";
    import { set_join_request } from "~/localstorage";
    import { useRouter } from "vue-router";

    let contract_address = ref("");
    let router = useRouter();

    let data = ref<any>(null);
    let not_found = ref(false);

    let username = ref("");
    let loading = ref(false);


    async function find() {
        not_found.value = false;
        data.value = null;

        try {
            let contract = new Contract(contract_address.value);
            data.value = await contract.getData();            
        } catch (e) {
            not_found.value = true;
        }
    }



    async function callJoin() {
        let contract = new Contract(contract_address.value);
        loading.value = true;

        try {
            await contract.join(username.value);
            set_join_request(contract_address.value, username.value);
            router.push("/requests");

        } catch (e) {
            alert("Произошла ошибка или отменена");
        }
        
    }


</script>

<template>

    <div px-16>
        <div>
            <h2 mt-12>Найти организацию</h2>

            <div max-w-500px flex gap-3>
                <input type="text" v-model="contract_address" class="form-control" placeholder="введите адрес контракта"/>
                <button class="btn btn-dark" @click="find()">найти</button>
            </div>   

            <div mt-5 max-w-500px class="card card-body" v-if="data !== null">
                <b text-green-7>Найдено!</b>
                <h4>{{ data.name }}</h4>
                <p>создатель {{ data.ownerName }}</p>

                <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#join">присоединиться</button>
            </div>

            <h5 v-if="not_found">Не найдено</h5>

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

    </div>

</template>
