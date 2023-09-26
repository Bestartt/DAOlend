<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    definePageMeta({layout: "union"})

    let route = useRoute();
    // @ts-ignore
    let address: string = route.params.address; 
    // @ts-ignore
    let member: string = route.params.member;

    let contract = new Contract(address);


    let { data, status, pending, refresh, error } = useAsyncData(async() => await contract.getMember(member));
 

</script>



<template>
    <div>
        <!-- header -->
        <div flex justify-between>
            <h4>Member details</h4>
            <button @click="refresh()" class="btn btn-dark">refresh</button>
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
                    <dt class="col-sm-3">address: </dt>
                    <dd class="col-sm-9">{{ data.member }}</dd>

                    <dt class="col-sm-3">joined date: </dt>
                    <dd class="col-sm-9">{{ new Date(data.joinedAt.toNumber()).toLocaleString("ru") }}</dd>

                    <dt class="col-sm-3">total deposit: </dt>
                    <dd class="col-sm-9">{{ data.contribution }}</dd>

                    
                </dl>
            </div>
        </div>
    </div>
</template>
