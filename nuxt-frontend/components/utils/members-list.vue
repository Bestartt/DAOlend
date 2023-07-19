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

    let { data, pending, status } = useAsyncData(props.fetchKey, async() => await contract.getMembersByAddresses(props.members));

    let currentMember = ref(null);

</script>


<template>
    <div>
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <ul v-auto-animate>
            <li v-for="(member, index) in data" position-relative>
                <nuxt-link :to="`/unions/${linkAddress}/${member.member}/member-detail/`"  class="dark-link">
                    {{ member.name }}
                </nuxt-link>

                <!-- <button class="btn btn-light"
                    @click="currentMember = member" data-bs-toggle="modal" :data-bs-target="`#member-modal-${fetchKey}`"
                >
                    {{ member.name }}
                </button> -->

            </li>
        </ul>


        <!-- May be later usage but for now we will use just links to member detail -->

        <!-- <div class="modal fade" :id="`member-modal-${fetchKey}`">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <template v-if="currentMember !== null">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">{{ currentMember.name }}</h1>
                            <button class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
        
                        <div class="modal-body">
                            <b>адрес: </b> <span>{{ currentMember.member }}</span> <br>
                            <b>депозит: </b> <span>{{ currentMember.contribution }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div> -->
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

