<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";

    let address = get_my_union();
    let contract: Contract;
    let data = ref<any>(null);
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getData().then(d => data.value = d);
    }

    const updateData = () => {
        contract.getData().then(d => data.value = d);
    }
    

</script>

<template>

    <my-sidebar-wrapper>
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
    </my-sidebar-wrapper>


</template>
