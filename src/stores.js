import { writable } from 'svelte/store'

export const chainId = writable(null)
export const uuid = writable(null)
export const tickets = writable(0)
export const ready = writable(false)
const location = window.location
const development = process.env.NODE_ENV==='development'
export const apiUrl = writable(`${location.protocol}//${location.hostname}:${development ? '2000' : location.port}/api`)