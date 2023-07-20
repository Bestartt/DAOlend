<script lang="ts" setup>
    let props = defineProps<{
        members: string[],
        contract: string
    }>();
</script>


<template>
    <modal>
        <slot><h4>Подтвердившие участники</h4></slot>
        <members-list :members="props.members" :contract="props.contract"></members-list>
      
    </modal>
</template>
