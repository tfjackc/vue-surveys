// // Utilities
// import { defineStore } from 'pinia'
// import { keys } from "@/data/keys";
//
// export const useSearchStore = defineStore('search', {
//   state: () => ({
//     form: false as boolean,
//     loading: false as boolean,
//     searchedValue: '' as string,
//     filteredData: [] as any[],
//   }),
//   getters: {
//     getValues(state) {
//       return state.form, state.loading, state.searchedValue, state.filteredData
//     }
//   },
//   actions: {
//     async onSubmit ()  {
//       console.log("on submit ran")
//       console.log(this.searchedValue)
//     }
//   }
// })
