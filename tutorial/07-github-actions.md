# Chapter 7: Running tests with GitHub Actions

In this chapter,
we will create a GitHub Actions workflow
to run our tests automatically as part of Continuous Integrations and GitOps


## Deciding how to run tests

Automated tests that are not configured to run as part of a Continuous Integration system are not *truly* automated.
They should be triggered to run as part of typical development workflows,
such as committing code or opening pull requests.
Thankfully, Playwright tests are straightforward to configure for Continuous Testing.

The first step is deciding *when* to run tests.
Ideally, tests should run as soon as possible after the codebase changes.
If test execution time is fast enough,
then tests could run as part of a pull request or after changes are merged into the main branch.
If test execution takes a while,
then a subset could be run after code changes,
and the rest could be scheduled to run ever few hours or even nightly.

The second step is deciding *where* to run tests.
Tests should be run within the same CI systems that the team uses for development.
This could be as lightweight as a GitHub Actions workflow,
or it could be part of a platform like Jenkins, Azure DevOps, CircleCI, or other similar tools.


## Writing the GitHub workflow

For this tutorial, let's create a GitHub Actions workflow to run the example tests.
GitHub Actions are built into GitHub repositories,
and they are free to use for open source projects.

We will write a workflow to run only the example tests.
The Trello-like app tests require a separate repository,
which is possible to create but significantly more difficult to configure.

GitHub Actions workflow can be triggered by many kinds of repository events.
The following triggers make the most sense for our end-to-end tests:

1. Whenever changes are pushed to the main branch
2. Whenever a pull request into the main branch is opened
3. Whenever someone wants to manually launch the tests

The workflow must clone the repository, install dependencies, and launch the tests.

Create a new directory under the project root named `.github/workflows`,
and create a file named `run-examples.yml` inside.
Add the following text to the file:

```yaml
name: Run the example tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check out project
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Clean install the project
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test tests/example.spec.ts tests/demo-todo-app.spec.ts

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```


## Running the workflow

You can run GitHub Actions workflow only from a GitHub repository.
If you want to run this action,
then you will need to create a repository for your project and upload your code.

To manually trigger the workflow,
click on the Actions tab in the repository web page,
select "Run the example tests",
and click "Run workflow".
You will see the workflow launch (hopefully) after a few seconds.
You can watch the console output as the workflows run.
