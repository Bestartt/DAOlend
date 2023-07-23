<script lang="ts" setup>
    import { onClickOutside } from '@vueuse/core'
    let modal = useModal();

    const dialog = ref();
    
    onClickOutside(dialog, (e) => {
        modal.close();
    });

    const route = useRoute();

  watch(route, value => {
        modal.close()
    }, {deep: true, immediate: true}
  )


</script>


<template>
    <div :class="{'my-modal': true, 'my-modal-active': modal.isOpen}">
        <div ref="dialog"  :class="{'my-modal-dialog': true, 'my-dialog-active': modal.isOpen}">
            <div flex justify-end>
                <button @click="modal.close()"  class="btn btn-close"></button>
            </div>
            <div px-10 py-1 pb-10>
                <slot><h3 text-gray>empty</h3></slot>                
            </div>

        </div>
    </div>
</template>



<style>
    /* look the end of style tag in app.vue */
</style>



