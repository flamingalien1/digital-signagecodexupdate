const fileDb = require('./fileDb')

module.exports = {
  get Display() {
    return fileDb.collection('displays')
  },
  get Widget() {
    return fileDb.collection('widgets')
  },
  get Slide() {
    return fileDb.collection('slides')
  },
  get Slideshow() {
    return fileDb.collection('slideshows')
  },
  get User() {
    return fileDb.collection('users')
  }
}
