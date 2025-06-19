const express = require('express')
const router = express.Router()

const { Display, Widget } = require('../../db')
const Keys = require('../../keys')
const DisplayHelper = require('../helpers/display_helper')
const CommonHelper = require('../helpers/common_helper')

// Route: /api/v1/display
router
  .get('/', async (req, res, next) => {
    try {
      let displays = await Display.find({})
      if (Keys.USE_FILE_DB) {
        if (!displays.length) {
          await DisplayHelper.newDisplay(req)
          displays = await Display.find({})
        }
        displays = displays.map(d => ({
          ...d,
          widgets: d.widgets.map(id => Widget.findById(id))
        }))
      } else {
        if (!displays.length) {
          await DisplayHelper.newDisplay(req)
        }
        displays = await Display.find({}).populate('widgets')
      }
      res.json(displays)
    } catch (err) {
      next(err)
    }
  })
  .post('/', (req, res, next) => {
    return DisplayHelper.newDisplay(req, res, next)
      .then(display => {
        if (!display) {
          next(new Error('Display not created'))
        }
        return CommonHelper.broadcastUpdate(res.io).then(() => res.json(display))
      })
      .catch(err => next(err))
  })

// Route: /api/v1/display/:id
router
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      let display = await Display.findById(id)
      if (!display) return next(new Error('Display not found'))
      if (Keys.USE_FILE_DB) {
        display = {
          ...display,
          widgets: display.widgets.map(wid => Widget.findById(wid))
        }
      } else {
        display = await Display.findById(id).populate('widgets')
      }
      res.json(display)
    } catch (err) {
      next(err)
    }
  })
  .get('/:id/widgets', async (req, res, next) => {
    try {
      const { id } = req.params
      let display = await Display.findById(id)
      if (!display) return next(new Error('Display not found'))
      let widgets
      if (Keys.USE_FILE_DB) {
        widgets = display.widgets.map(wid => Widget.findById(wid))
      } else {
        display = await Display.findById(id).populate('widgets')
        widgets = display.widgets
      }
      res.json(widgets)
    } catch (err) {
      next(err)
    }
  })
  .delete('/:id', (req, res, next) => {
    const { id } = req.params
    return Display.findByIdAndDelete(id)
      .then(display => {
        if (!display) return next('Display not found')
        return DisplayHelper.deleteWidgets(display.widgets, res).then(() => {
          return res.json({ success: true })
        })
      })
      .catch(err => next(err))
  })
  .patch('/:id', (req, res, next) => {
    const { id } = req.params
    return Display.findById(id)
      .then(display => {
        if (!display) return next(new Error('Display not found'))

        if ('name' in req.body) display.name = req.body.name
        if ('layout' in req.body) display.layout = req.body.layout
        if ('statusBar' in req.body) display.statusBar = req.body.statusBar

        return display
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })

module.exports = router
