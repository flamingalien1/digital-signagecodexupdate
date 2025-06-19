const express = require('express')
const router = express.Router()
const arrayMove = require('array-move')

const { Slideshow, Slide } = require('../../db')
const Keys = require('../../keys')
const SlideshowHelper = require('../helpers/slideshow_helper')
const CommonHelper = require('../helpers/common_helper')

// Route: /api/v1/slideshow
router
  .get('/', async (req, res, next) => {
    try {
      let slideshows = await Slideshow.find({})
      if (Keys.USE_FILE_DB) {
        slideshows = slideshows.map(s => ({
          ...s,
          slides: s.slides.map(id => Slide.findById(id))
        }))
      } else {
        slideshows = await Slideshow.find({}).populate('slides')
      }
      res.json(slideshows)
    } catch (err) {
      next(err)
    }
  })
  .post('/', (req, res, next) => {
    const newSlideShow = new Slideshow({
      title: req.body.title
    })
    return newSlideShow
      .save()
      .then(slideshow => {
        if (!slideshow) {
          next(new Error('Slideshow not created'))
        }
        return CommonHelper.broadcastUpdate(res.io).then(() => res.json(slideshow))
      })
      .catch(err => next(err))
  })

// Route: /api/v1/slideshow/:id
router
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      let slideshow = await Slideshow.findById(id)
      if (!slideshow) return next(new Error('Slideshow not found'))
      if (Keys.USE_FILE_DB) {
        slideshow = {
          ...slideshow,
          slides: slideshow.slides.map(id => Slide.findById(id))
        }
      } else {
        slideshow = await Slideshow.findById(id).populate('slides')
      }
      res.json(slideshow)
    } catch (err) {
      next(err)
    }
  })
  .get('/:id/slides', async (req, res, next) => {
    try {
      const { id } = req.params
      let slideshow = await Slideshow.findById(id)
      if (!slideshow) return next(new Error('Slideshow not found'))
      let slides
      if (Keys.USE_FILE_DB) {
        slides = slideshow.slides.map(id => Slide.findById(id))
      } else {
        slideshow = await Slideshow.findById(id).populate('slides')
        slides = slideshow.slides
      }
      res.json(slides)
    } catch (err) {
      next(err)
    }
  })
  .delete('/:id', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findByIdAndDelete(id)
      .then(slideshow => {
        if (!slideshow) return next('Slideshow not found')
        return SlideshowHelper.deleteSlides(slideshow.slides, res).then(() => {
          return res.json({ success: true })
        })
      })
      .catch(err => next(err))
  })
  .patch('/:id/reorder', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .then(slideshow => {
        if (!slideshow) return next(new Error('Slideshow not found'))

        const oldIndex = req.body.oldIndex
        const newIndex = req.body.newIndex
        slideshow.slides = arrayMove(slideshow.slides, oldIndex, newIndex)

        return slideshow
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })
  .patch('/:id', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .then(slideshow => {
        if (!slideshow) return next(new Error('Slideshow not found'))

        if ('title' in req.body) slideshow.title = req.body.title

        return slideshow
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })

module.exports = router
