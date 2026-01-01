interface FormRef {
  validate: () => Promise<boolean>
}

export const useValidation = () => {
  const formRefs = ref<Record<string, FormRef>>({})
  const isValidForm = async () => {
    let isValid = true

    for (const [, ref] of Object.entries(formRefs.value)) {
      if (ref && typeof ref.validate === 'function') {
        const valid = await ref.validate()
        if (!valid) {
          isValid = false
        }
      }
    }

    return isValid
  }

  const formRefsList = ref<Record<string, FormRef>[]>([])

  const isValidFormList = async () => {
    let isAllValid = true

    for (const refs of formRefsList.value) {
      for (const [, ref] of Object.entries(refs)) {
        if (ref && typeof ref.validate === 'function') {
          const valid = await ref.validate()
          if (!valid) {
            isAllValid = false
          }
        }
      }
    }

    return isAllValid
  }

  const validateAllForms = async () => {
    const staticValid = await isValidForm()
    const dynamicValid = await isValidFormList()
    return staticValid && dynamicValid
  }

  return {
    formRefs,
    isValidForm,
    formRefsList,
    isValidFormList,
    validateAllForms
  }
}
