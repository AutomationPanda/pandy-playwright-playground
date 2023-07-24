# Chapter 3: Writing our first test

In this chapter,
we will write our first Playwright test together
for a Trello-like web app that we will run locally.


## Setting up a local web app

Instead of testing some arbitrary public website,
let's test a web app that we can run and control locally
as if we were developing the app and its tests in tandem.
For this tutorial, we will use a Trello-like web app developed by [Filip Hric](https://github.com/filiphric).
The app is written in TypeScript using Vue 3, Vite, and Tailwind CSS.
Filip has granted his permission for us to use this project.

The GitHub repository for this app is:<br>
https://github.com/filiphric/trelloapp-vue-vite-ts

Clone the repository in a separate location from the `awesome-playwright-tests`:

```
cd </some/different/path>
git clone https://github.com/filiphric/trelloapp-vue-vite-ts.git
```

Then, install the project's dependencies:

```
cd trelloapp-vue-vite-ts
npm install
```

Make sure there are no errors.
Finally, run the app:

```
npm start
```

You should see output like this once the app is ready:

```
vite v2.9.12 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 357ms.
```

Open a web browser to the local address provided (http://localhost:3000/),
and you should see the app's "Get Started!" page:

![Trello Get Started page](images/ch03/trello-get-started.png)


## Generating a script

?


## Converting it into a test case

?


## Adding database prep

?


## Running the test (carefully)

?
