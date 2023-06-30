<script lang="ts" setup>
    import { Contract } from "~/utils/crypto";

    let route = useRoute();
    let address = route.params.address;
    let contract: Contract;
    let data = ref<any>(null);
    
    
    if (address != null) {
        // @ts-ignore
        contract = new Contract(address);
        contract.getData().then(d => data.value = d);
    }

    const updateData = () => {
        contract.getData().then(d => data.value = d);
    }
    

</script>

<template>
    <sidebar-wrapper>
        <h4>Данные</h4>

        <table class="table" max-w-lg>
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
                    <td>{{ data.memberNames.length }}</td>
                </tr>
            </tbody>
        </table>

        <button 
            class="btn btn-dark" 
            data-bs-toggle="modal" 
            data-bs-target="#add_deposit"
        >
            Добавить вложение
        </button>

        <add-deposit-modal :contract-address="address" @on-complete="updateData()"/>        
    </sidebar-wrapper>


</template>
