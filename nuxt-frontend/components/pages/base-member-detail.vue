<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    let props = defineProps<{
        contract: string,
        member: string
    }>();

    let contract = new Contract(props.contract);


    let { data, status, pending } = useAsyncData(async() => await contract.getMember(props.member));
 

</script>



<template>
    <div>
        <!-- header -->
        <div flex justify-between>
            <h4>Данные</h4>
            <button @click="refresh()" class="btn btn-dark">обновить</button>
        </div>

        <!-- card -->
        <div class="card card-body mt-3" v-auto-animate>

            <!-- loading -->
            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <!-- error -->
            <b v-if="status == 'error'">
                {{ error }}
            </b>
            
            <div class="card-body" v-if="status == 'success'">
                <h2>{{ data.name }}</h2>

                <dl class="row">
                    <dt class="col-sm-3">адрес: </dt>
                    <dd class="col-sm-9">{{ data.member }}</dd>

                    <dt class="col-sm-3">дата вступление: </dt>
                    <dd class="col-sm-9">{{ new Date(data.joinedAt.toNumber()).toLocaleString("ru") }}</dd>

                    <dt class="col-sm-3">сумма депозита: </dt>
                    <dd class="col-sm-9">{{ data.contribution }}</dd>

                    
                </dl>
            </div>
        </div>
    </div>
</template>
