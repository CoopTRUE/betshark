import { writable } from 'svelte/store'

export const uuid = writable(null)
export const address = writable(null)
export const tickets = writable(0)