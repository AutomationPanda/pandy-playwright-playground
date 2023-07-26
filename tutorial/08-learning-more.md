# Chapter 8: Learning and practicing more

Congratulations!
You have finished the guided portion of this tutorial.
From this point forward, your learning will be self-guided.

In this chapter,
you will have the opportunity to write more tests independently
and further improve the test automation project.
There will also be resources for learning more after this tutorial.


## Writing more tests

In this tutorial, we wrote only a few tests for the Trello-like app.
Try writing tests for more behaviors.
Here are some ideas:

* creating multiple boards
* deleting boards
* renaming boards
* starring boards
* creating multiple lists in a board
* deleting lists
* renaming lists
* deleting cards
* renaming cards
* opening and closing cards
* moving a card to change the order of a list
* moving a card to a different list
* changing a card's data


## Improving the project

There are many ways we could improve our small test project.
Here are some ideas.

* The Trello-like app can have user accounts.
  Try creating some users and updating tests to use them with login.
  Read Playwright's [Authentication](https://playwright.dev/docs/auth) guide for insights.
* Try using a different test data management strategy,
  such as running multiple app instances or using one user account per parallel worker.
* Instead of using page objects, try the Screenplay Pattern.
* Update the GitHub Actions workflow to run the Trello-like tests.


## Learning more

* [Test Automation University](https://testautomationu.applitools.com/)
  offers a [Playwright learning path](https://testautomationu.applitools.com/learningpaths.html?id=playwright-path).
* Playwright has an active [Discord server](https://discord.com/servers/playwright-807756831384403968)
  where you can join the community.
