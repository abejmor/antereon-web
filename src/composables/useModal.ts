export const useModal = (initialState: boolean = false): {
    showModal: Ref<boolean>;
    openModal: ()=> void;
    closeModal: ()=> void;
    toggleModal: ()=> void;
} => {
  const showModal = ref(initialState)

  const openModal = () => {
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
  }

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  return {
    showModal,
    openModal,
    closeModal,
    toggleModal
  }
}
