const express = require('express')
const router = express.Router()

const { Widget } = require('../../db')
const CommonHelper = require('../helpers/common_helper')
const WidgetHelper = require('../helpers/widget_helper')

// GET /widgets
router.get('/', async (req, res, next) => {
  try {
    const widgets = await Widget.find({})
    res.json(widgets)
  } catch (err) {
    next(err)
  }
})

// POST /widgets
router.post('/', async (req, res, next) => {
  try {
    const widget = new Widget({
      type: req.body.type,
      data: req.body.data,
      display: req.body.display,
      x: req.body.x,
      y: req.body.y,
      w: req.body.w,
      h: req.body.h
    })
    await widget.save()
    await WidgetHelper.addWidget(widget, res)
    await CommonHelper.broadcastUpdate(res.io)
  } catch (err) {
    next(err)
  }
})

// GET /widgets/:id
router.get('/:id', async (req, res, next) => {
  try {
    const widget = await Widget.findById(req.params.id)
    if (!widget) return next(new Error('Widget not found'))
    res.json(widget)
  } catch (err) {
    next(err)
  }
})

// PUT /widgets/:id
router.put('/:id', async (req, res, next) => {
  try {
    const widget = await Widget.findById(req.params.id)
    if (!widget) return next(new Error('Widget not found'))

    ;['type', 'data', 'display', 'x', 'y', 'w', 'h'].forEach(key => {
      if (req.body[key] !== undefined) widget[key] = req.body[key]
    })

    await widget.save()
    await CommonHelper.broadcastUpdate(res.io)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// DELETE /widgets/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const widget = await Widget.findByIdAndDelete(req.params.id)
    if (!widget) return next(new Error('Widget not found'))
    await WidgetHelper.deleteWidget(widget, res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
