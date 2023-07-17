<script setup lang="ts">
    import { Contract } from '~/utils/contract';
    import { useAsyncData } from 'nuxt/app';

    let props = defineProps<{
        approvedMembers: string[],
        contractAddress: string
    }>();

    let contract = new Contract(props.contractAddress);

    let { data, pending } = useAsyncData(async() => await contract.getMembersByAddresses(props.approvedMembers));

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
                <button class="btn btn-light"

                    @click="currentMember = member" data-bs-toggle="modal" :data-bs-target="`#member-modal`"
                >
                    {{ member.name }}
                </button>

            </li>
        </ul>


        <div class="modal fade" id="member-modal">
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
        </div>
    </div>

</template>


