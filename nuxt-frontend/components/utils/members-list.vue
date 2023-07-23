<script setup lang="ts">
    import { Contract } from '~/utils/contract';
    import { useAsyncData, useRoute } from 'nuxt/app';

    let props = defineProps<{
        members: string[],
        contract: string
    }>();

    let route = useRoute();
    let isMy = route.path.includes("/unions/my");
    let linkAddress = isMy ? "my" : props.contract;

    let contract = new Contract(props.contract);

    let { data, pending, status, refresh } = useAsyncData(
        uuid(), 
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

        <b v-if="status == 'success' && data.length == 0" text-gray>Подтвердивших пока нет</b>

    </div>

</template>
