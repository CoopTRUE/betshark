import { mongoose } from 'mongoose'
import Account from './models/Account.js'

export async function connect() {
  console.log('Connecting to betshark database...')
  await mongoose.connect(process.env.BETSHARK_URI, { useNewUrlParser: true })
  console.log('Connected to betshark database')
}

export async function findAccount(addressOrUUID) {
  let account
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(addressOrUUID)) {
    console.log('Finding account by UUID')
    account = await Account.findOne({ uuid: addressOrUUID })
  } else {
    console.log('Finding account by address')
    account = await Account.findOne({ address: addressOrUUID })
  }
  return account
}

export async function createAccount(address, uuid) {
  const account = new Account({ address, uuid, tickets: 0 })
  await account.save()
}

export async function addTickets(addressOrUUID, tickets) {
  const account = await findAccount(addressOrUUID)
  if (account === null) {
    throw new Error('Account not found with identifier ' + addressOrUUID)
  }
  account.tickets += tickets
  await account.save()
}

export async function removeTickets(addressOrUUID, tickets) {
  const account = await findAccount(addressOrUUID)
  if (account === null) {
    throw new Error('Account not found with identifier ' + addressOrUUID)
  }
  account.tickets -= tickets
  await account.save()
}