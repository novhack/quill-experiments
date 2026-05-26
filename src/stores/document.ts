import { defineStore } from 'pinia'
import { Delta } from 'vue-quill-next'

export type DeltaOp = {
  origin: string
  delta: Delta
}

export const useDocumentStore = defineStore('document', {
  state: () => ({
    ops: [] as DeltaOp[],
  }),
  actions: {
    publish(origin: string, delta: Delta) {
      this.ops.push({ origin, delta })
    },
  },
})
