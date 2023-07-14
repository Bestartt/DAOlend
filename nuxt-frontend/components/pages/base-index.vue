<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{address: string}>();
    let address = props.address;
    let contract: Contract = new Contract(address);

    let { data, pending, error, refresh, status } = useAsyncData(async () => await contract.getData());

    watch(status, () => {
        if (status.value == "error") {
            console.log(error.value);
        }
    })

</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Данные</h4>
            <button @click="refresh()" class="btn btn-dark">обновить</button>
        </div>

        <div class="card card-body max-w-700px" >
            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <b v-if="status == 'error'">
                {{ error }}
            </b>

            <table class="table" max-w-lg v-if="data !== null && !pending">
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
                        <td>{{ address }} </td>
                    </tr>
                    <tr>
                        <td>Колличество участников: </td>
                        <td>{{ data.members.length }}</td>
                    </tr>
                </tbody>
            </table>   

            <div flex mt-5> 
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
            </div>            
        </div>



        <add-deposit-modal :contract-address="address" @on-complete="updateData()"/>  
        <request-credit-modal :contract-address="address" @on-complete="updateData()"/>        
    </div>


</template>
