import { defineStore } from 'pinia'

export type CursorRange = { index: number; length: number } | null

export type User = {
  name: string
  color: string
  range: CursorRange
}

function randomContrastingColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.floor(Math.random() * 20)
  const lightness = 30 + Math.floor(Math.random() * 15)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: {} as Record<string, User>,
  }),
  actions: {
    register(name: string) {
      if (this.users[name]) return
      this.users[name] = {
        name,
        color: randomContrastingColor(),
        range: { index: 0, length: 0 },
      }
    },
    setCursor(name: string, range: CursorRange) {
      const user = this.users[name]
      if (!user) return
      user.range = range
    },
  },
})
