const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const Schema = mongoose.Schema

const Display = new Schema({
  name: { type: String },
  layout: { type: String, default: 'spaced', enum: ['compact', 'spaced'] },
  statusBar: {
    type: [{ type: String }],
    default: () => [
      'date_' + nanoid(),
      'spacer_' + nanoid(),
      'connection_' + nanoid(),
      'time_' + nanoid()
    ]
  },
  widgets: [{ type: Schema.Types.ObjectId, ref: 'Widget' }]
})

module.exports = mongoose.model('Display', Display)
