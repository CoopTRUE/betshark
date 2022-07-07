import { mongoose } from 'mongoose'
import Account from './models/Account.js'

export async function connect() {
  console.log('Connecting to betshark database...')
  await mongoose.connect(process.env.BETSHARK_URI, { useNewUrlParser: true })
  console.log('Connected to betshark database')
}

export async function findAccount(sigOrUUID) {
  let account
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sigOrUUID)) {
    account = await Account.findOne({ uuid: sigOrUUID })
  } else {
    account = await Account.findOne({ sig: sigOrUUID })
  }
  return account
}

export async function createAccount(address, sig, uuid) {
  const account = new Account({ address, sig, uuid, tickets: 0 })
  await account.save()
}

export async function addTickets(sigOrUUID, tickets) {
  const account = await findAccount(sigOrUUID)
  if (account === null) {
    throw new Error('Account not found with identifier ' + sigOrUUID)
  }
  account.tickets += tickets
  await account.save()
}

export async function removeTickets(sigOrUUID, tickets) {
  const account = await findAccount(sigOrUUID)
  if (account === null) {
    throw new Error('Account not found with identifier ' + sigOrUUID)
  }
  account.tickets -= tickets
  await account.save()
}