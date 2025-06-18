## DigitalSignage

*📺 Simple self-hosted digital signage software for turning screens into beautiful content displays*

![Outdated Dependencies](https://david-dm.org/wassgha/digital-signage.svg) ![Travis Build](https://travis-ci.org/wassgha/digital-signage.svg?branch=master)

### Screenshots

Digital Display Preview

![Screenshot of the display](assets/preview.png?raw=true)

Administrator Panel: Changing the widget layout

![Screenshot of the administrator panel](assets/layout.png?raw=true)

Administrator Panel: Slides inside a slideshow

![Screenshot of the administrator panel](assets/slides.png?raw=true)


### Demo

Use the demo website at [http://digitaldisplay.herokuapp.com](http://digitaldisplay.herokuapp.com) (username: **demo**, password: **demo**)

### How to Run:

This project requires **Node.js 18** or later.

1. Set up a MongoDB installation locally (or in the cloud) and create a `digitaldisplay` database

2. Run the setup utility using

```bash
npm run setup
```
This command checks if a `.env` file exists. If not, it copies `.env.example` (if present) to `.env`. When no example file is found, it falls back to running the interactive `makeconf` utility so you can provide your own values.

The script copies configuration from `.env.example`. Update the file as needed.

The default example uses the following MongoDB URI:

```bash
MONGODB_URI=mongodb+srv://bdowdy:November15@cluster0.onongy1.mongodb.net/
```

If you don't have MongoDB available, set `USE_FILE_DB=true` in `.env` to store
data in a local JSON file instead.

3. Install dependencies and run the program

```bash
npm install
npm run dev
```

Server activity and errors are written to `logs/access.log` and `logs/error.log`.
When running `npm run dev`, the same information is also printed to the console so
you can see issues immediately.

### Updating the software

Assuming the software was cloned from this github repository, it is possible to use the included script

```bash
npm run update
```

which pulls the latest stable version of `digital-signage` from github, installs dependencies and re-builds the software.

### Features

- ✅ Automatic refresh on content change (you should never need to touch a display once set up!)
- ✅ Totally modular, with a comprehensive widget management system (adding a widget is very simple!)
- ✅ Multiple built-in widgets to get you started:
  - ✅ Slideshow widget

    <img src="assets/slideshow.gif?raw=true" height="300" alt="Animated screencast of the slideshow widget" />

  - ✅ Weather widget

    <img src="assets/weather.png?raw=true" height="200" alt="Screenshot of the weather widget" />

  - ✅ "Congratulations" widget

    <img src="assets/congratulations.gif?raw=true" height="200" alt="Animated screencast of the congratulations widget" />

  - ✅ Youtube embed widget
  - ✅ Web (iframe) widget

    <img src="assets/web.png?raw=true" height="200" alt="Screenshot of the web widget" />

  - ✅ Standalone image widget

    <img src="assets/standalone-image.png?raw=true" height="200" alt="Screenshot of the image widget" />

  - ✅ Announcements widget

    <img src="assets/announcements.png?raw=true" height="200" alt="Screenshot of the announcements widget" />

  - ✅ List widget (can be used a directory, time sheet, etc.)

    <img src="assets/list.gif?raw=true" height="200" alt="Animated screencast of the list widget" />

- ✅ Flexible, responsive widget grid that allows you to drag, drop and resize widgets
- ✅ Versatile slideshow system that allows multiple slideshows, multiple slide types (images, videos, youtube, web, etc.) inside the same display with variable durations, titles and descriptions for each slide!
- ✖ Support for multiple displays (in progress)


### Adding a new widget

Given the highly modular structure of this program, implementing a new widget is a simple task! Simply follow these easy steps to get started:
1. Create a new folder inside the `​widgets/​` folder, name it according to your widget's name

```
 /
  actions/
  api/
  assets/
  components/
  helpers/
  pages/
  styles/
  widgets/
    .
    .
    .
    (new) MyWidget/
    widget_list.js
    base_widget.js
    index.js

```
2. Create an index file inside the newly created folder called `index.js` ​(extending the​ `base_widget` ​class) as follows:

```js
import BaseWidget from '../base_widget'

export default class MyWidget extends BaseWidget {
  constructor() {
    super({
      name: 'MyWidget',
      version: '0.1',
      icon: ['my-icon'], // Shown in the admin panel
      defaultData: {
         // Your implementation here
      }
    })
  }
}
```

The widget's icon should come from `FontAwesome`.

3. Implement two `React` components: `Options` (renders the dialog that will allow the administrator to change the widget’s configuration) and `Widget` (renders the user-facing side widget that will be displayed on the TV), return them from getter functions that you add to your `index.js` file:

```js
export default class MyWidget extends BaseWidget {
  // ...

  get Widget() {
    return (<div>Your implementation here</div>)
  }

  get Options() {
    return (<div>Your implementation here</div>)
  }

  // ...
}
```

4. Finally, when done implementing the widget, register it by adding its folder’s name to the `widgets/widget_list.js​` file

```js
module.exports = ['slideshow', 'weather', 'congrats', 'youtube', 'web',
    'image', 'list', 'announcement', /* new */ 'MyWidget']
```

5. Restart the server to see the new widget appear on the administrator panel
