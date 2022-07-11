import mongoose from 'mongoose'

export default mongoose.model('tickettransactions', new mongoose.Schema({
  hash: String,
}))