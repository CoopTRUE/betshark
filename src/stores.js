import { writable } from 'svelte/store'

export const chainId = writable(null)
export const uuid = writable(null)
export const tickets = writable(0)
export const ready = writable(false)