const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')

const dbPath = path.join(__dirname, 'db.json')

function load() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ displays: [], widgets: [], slides: [], slideshows: [], users: [] }, null, 2)
    )
  }
  return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

class Collection {
  constructor(name, data) {
    this.name = name
    this.data = data
  }

  find(query = {}) {
    const res = this.data[this.name].filter(doc => {
      return Object.keys(query).every(key => doc[key] === query[key])
    })
    return Promise.resolve(res)
  }

  findOne(query = {}) {
    return this.find(query).then(list => list[0] || null)
  }

  findById(id) {
    const doc = this.data[this.name].find(doc => doc._id === id) || null
    return Promise.resolve(doc)
  }

  findByIdAndRemove(id) {
    return Promise.resolve(this.removeById(id))
  }

  findByIdAndDelete(id) {
    return Promise.resolve(this.removeById(id))
  }

  estimatedDocumentCount() {
    return Promise.resolve(this.data[this.name].length)
  }

  create(doc) {
    doc._id = nanoid()
    this.data[this.name].push(doc)
    save(this.data)
    return Promise.resolve(doc)
  }

  removeById(id) {
    const idx = this.data[this.name].findIndex(doc => doc._id === id)
    if (idx === -1) return null
    const [doc] = this.data[this.name].splice(idx, 1)
    save(this.data)
    return doc
  }

  updateById(id, updates) {
    const doc = this.findById(id)
    if (!doc) return null
    Object.assign(doc, updates)
    save(this.data)
    return Promise.resolve(doc)
  }

  save(doc) {
    if (doc._id) {
      return this.updateById(doc._id, doc)
    }
    return this.create(doc)
  }
}

class FileDB {
  constructor() {
    this.data = load()
    this.collections = {}
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(name, this.data)
    }
    return this.collections[name]
  }
}

module.exports = new FileDB()
