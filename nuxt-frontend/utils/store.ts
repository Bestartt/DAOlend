import { defineStore } from "pinia";



export const useNotification = defineStore('notifications', () => {
    const isOpen = ref(false);
    const title = ref("Default");
    const description = ref("Hmmm");
    const link = ref("");

    function notify(_title: string, _description: string = "", _link: string = "") {
        isOpen.value = true;
        title.value = _title;
        description.value = _description;
        link.value = _link;

    }

    function close() {
        isOpen.value = false;
    }

    return { isOpen, title, link, notify, close, description }

})


export const useModal = defineStore('modal', () => {
    let isOpen = ref(false);

    return { isOpen }

})

