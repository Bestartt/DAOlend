<script lang="ts" setup>
    import { onClickOutside } from '@vueuse/core'

    let props = defineProps<{isOpen: boolean}>();
    let emit = defineEmits(['onClose']);

    const dialog = ref();
    
    onClickOutside(dialog, (e) => {
        emit('onClose');
    });


</script>


<template>
    <div :class="{'my-modal': true, 'my-modal-active': props.isOpen}">
        <div ref="dialog"  :class="{'my-modal-dialog': true, 'my-dialog-active': props.isOpen}">
            <div flex justify-end>
                <button @click="$emit('onClose')"  class="btn btn-close"></button>
            </div>
            <div px-3 py-1 pb-10>
                <slot><h3 text-gray>empty</h3></slot>                
            </div>

        </div>
    </div>
</template>



<style scoped>

    .my-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;   
        height: 0;
        transform: translate(-50%, -50%);
        overflow: hidden;

        background-color: transparent;
        z-index: 10;  
        transition: 0.2s;
    }

    .my-modal-active {
        width: 100vw;
        height: 100vh;
        display: block;
        background-color:rgba(0,0,0,0.3);
    }

    .my-modal-dialog {
        width: 0;
        height: 0;
        overflow: hidden;
        position: fixed;
        border-radius: 10px;
        transition: 0.2s;
        z-index: 11;
        
        display: flex;
        flex-direction: column;
        box-shadow: 0 5px 30px 0 rgba(0,0,0, 0.05);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
    }

    .my-dialog-active {
        height: auto;
        width: 400px;
    }

    .btn-close {
        padding: 10px 10px;
        box-shadow: 0px 0px 10px gray;
    }
</style>



