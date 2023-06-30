<script lang="ts" setup>
    import { Contract } from "~/utils/crypto";

    definePageMeta({layout: "my-union"})

    let address = get_my_union();
    let contract: Contract;
    let data = ref<any>(null);
    
    
    async function updateData() {
        contract = new Contract(address);
        data.value = await contract.getData();
    }

    onBeforeMount(async () => {
        await updateData();
    })
    

</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Данные</h4>
            <button @click="updateData()" class="btn btn-dark">обновить</button>
        </div>

        <table class="table" max-w-lg v-if="data !== null">
            <tbody>
                <tr>
                    <td>Создатель:</td>
                    <td> {{ data.ownerName }}</td>
                </tr>
                <tr>
                    <td>имя: </td>
                    <td>{{ data.name }}</td>
                </tr>
                <tr>
                    <td>Общий вклад</td>
                    <td>{{ data.totalDeposit }}</td>
                </tr>
                <tr>
                    <td>Адрес: </td>
                    <td>{{ get_my_union() }} </td>
                </tr>
                <tr>
                    <td>Колличество участников: </td>
                    <td>{{ data.memberNames.length }}</td>
                </tr>
            </tbody>
        </table>

        <button 
            class="btn btn-dark" 
            data-bs-toggle="modal" 
            data-bs-target="#add_deposit"> 
            Добавить вложение
        </button>

        <button 
            ms-1 class="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target="#request_credit"
        >
            Создать заявку на кредит
        </button>

        <add-deposit-modal :contract-address="address" @on-complete="updateData()"/>
        <request-credit-modal :contract-address="address" @on-complete="updateData()"/>          
    </div>
 



</template>
