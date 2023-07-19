<script setup lang="ts">
    import { Contract } from '~/utils/contract';
    import { useAsyncData, useRoute } from 'nuxt/app';

    let props = defineProps<{
        members: string[],
        contract: string,
        fetchKey: string
    }>();

    let route = useRoute();
    let isMy = route.path.includes("/unions/my");
    let linkAddress = isMy ? "my" : props.contract;

    let contract = new Contract(props.contract);

    let { data, pending, status, refresh } = useAsyncData(
        props.fetchKey, 
        async() => await contract.getMembersByAddresses(props.members)
    );
</script>


<template>
    <div>
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <ul v-auto-animate v-if="status == 'success'">
            <li v-for="(member, index) in data" position-relative>
                <nuxt-link :to="`/unions/${linkAddress}/${member.member}/member-detail/`"  class="dark-link">
                    {{ member.name }}
                </nuxt-link>

            </li>
        </ul>

        <button @click="refresh()" class="btn btn-light btn-sm">обновить</button>

    </div>

</template>


<style>
    .dark-link {
        text-underline-offset: 0.25em!important;
        color: #3a3a3a;
        text-decoration-color: #959595;
        transition: all 0.5s;
    }

    .dark-link:hover {
        color: black;
        font-weight: 115%;
        text-decoration-color: black;
    }
</style>

