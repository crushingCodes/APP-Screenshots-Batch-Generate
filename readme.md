# App Generate Screenshots
## Welcome

This is a new project built for the purpose of providing a quick method to generate images for the different sizes and orientations for major app platforms.
The original version will run primarily as a web app using Javascript.

### Usage
#### NPM Installation

`npm i -g app-g-screenshots`

##### NPM Instructions
Type `app-g-screenshots -h` for a list of commands. The app is designed to search the configured folder for images and then generate them in the configured output folder.

##### Limitations
* Requires node@7.6 or above.
* Can only store one global configuration at a time. If dealing with multiple projects, you should use the --in and --out options every time you use the -g function, which will set configuration on the fly.
* Only has two profiles for two operating systems and two size profiles, will add to this list on request.

#### Web App
You can run the code in the browser from Codepen below:

[Checkout the Codepen](https://codepen.io/crushingcodes/pen/bZRpKJ#)

##### Web App Instructions
Upload one picture or more pictures and you can output default screenshot sizes for ios and android phone and tablet.
