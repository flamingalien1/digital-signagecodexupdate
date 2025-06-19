const { Display } = require('../../db')
const CommonHelper = require('./common_helper')

function addWidget(widget, res) {
  return Display.findById(widget.display)
    .then(display => {
      if (!display) return res.status(404).json({ error: 'Display not found' })
      display.widgets.push(widget._id)
      return display.save().then(saved => {
        if (!saved) return res.status(500).json({ error: 'Display not saved' })
        return res.json({ success: true })
      })
    })
    .catch(err => res.json(err))
}

function deleteWidget(widget, res) {
  return Display.findById(widget.display).then(display => {
    if (!display) return res.status(404).json({ error: 'Display not found' })
    display.widgets = display.widgets.filter(function(value) {
      return !widget._id.equals(value)
    })
    return display
      .save()
      .then(() => CommonHelper.broadcastUpdate(res.io))
      .then(() => {
        return res.json({ success: true })
      })
  })
}

module.exports = {
  deleteWidget,
  addWidget
}
