import mongoose from 'mongoose'

export default mongoose.model('ticketTransactions', new mongoose.Schema({
  hash: String,
}))