// Utilities
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('app', {
  state: () => ({
    form: false as boolean,
    loading: false as boolean,
    searchedValue: '' as string,
    filteredData: [] as any[],
  }),
  getters: {
    getValues(state) {
      return state.form, state.loading, state.searchedValue, state.filteredData
    }
  },
  actions: {
    async onSubmit ()  {
      console.log("on submit ran")
      console.log(this.searchedValue)
    }
  }
})
