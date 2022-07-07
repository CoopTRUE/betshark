import mongoose from 'mongoose'

export default mongoose.model('accounts', new mongoose.Schema({
  address: String,
  sig: String,
  uuid: String,
  tickets: Number
}))