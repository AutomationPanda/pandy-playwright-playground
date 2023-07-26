# Chapter 6: Scaling tests with parallel execution

In this chapter,
we will improve our tests so that we can scale them up
by running them in parallel across different browsers.


## Attempting parallel execution

Ever since we started writing tests for the Trello-like app,
We have run our tests *serially*, meaning one at a time.
Try running them in *parallel*, and watch what happens:

```
npx playwright test tests/trello.spec.ts
```

Inevitably, some of the tests will fail due to a *collision* on the test data.
Before each test, the suite resets the whole database.
All tests target one instance of the Trello-like app running on the local machine,
so resetting the database impacts *all* tests that happen to be running.
Resetting at just the wrong moment can destroy the boards, lists, and cards that tests needed.


## Evaluating data management strategies

Playwright executes tests in parallel across a set of workers.
The workers run in parallel, but the tests on each individual worker execute serially.
There are a few ways to avoid test data collisions across these workers.

One way is to use *multiple instances of the web app*.
We could run one instance of the app for each worker,
in which each app instance would have its own database.
In this case, there is no chance one worker could affect the app or data for another worker.
However, launching multiple app instances can be difficult to set up,
and it might use a lot of system resources.

A second way is to use *separate test data sets per worker*.
For example, in many apps, one user cannot access another user's data.
If each worker uses its own user account exclusively, then workers won't collide.
There are other ways to separate test data sets as well.
In Playwright, we could map the worker's parallel index to specific data sets (like users).
Separate test data sets may be easier to manage than multiple app instances,
but they still need careful management.

A third way is to *write tests so their test data won't collide*.
This means that any data that more than one test (or worker) could access
must be treated as *immutable* (or constant).
Any data that a test creates dynamically must be used exclusively by that test.
This is the easiest strategy when managing environments and data are too difficult (or just not possible).
However, it often limits the coverage that tests can have.
Certain tests will need to modify shared data,
and those tests must either be skipped or run serially apart from the parallel execution.


## Rewriting tests to avoid collisions

For this tutorial, data management strategy #3 is the easiest to pursue.
Let's change the code to make it happen.


### Recognizing lost coverage

Unfortunately, this data management strategy will require us to skip the "Get Started!" page.
The "Get Started!" page only appears when the app has no boards created.
Since each test requires a board, and since all boards are shared,
we cannot force the "Get Started!" page to appear.

To keep things simple, we will remove tests and interactions with the "Get Started!" page.
We will also change the before hook to create a new board for each test with a unique name via API.
That way, each test can have a common starting point.


### Adding interactions to the My Boards page

Since we will remove the "Get Started!" page,
we need to add new interactions to the "My Boards" page.

When each test starts and creates its board, it will load the home page,
which should redirect to the "My Boards" page instead of the "Get Started!" page.
Add a method to load the page to `tests/pages/my-boards.ts`:

```typescript
    async load() {
        await this.page.goto('http://localhost:3000/');
    }
```

To load the board page, the test needs to open the board by its name.
Add a method for that, too:

```typescript
    async openBoard(boardName: string) {
        await this.page.getByText(boardName).click();
    }
```


### Rewriting test setup

The current `test.beforeEach` hook resets the entire database and creates the first board.
Its code is below: 

```typescript
    const boardName = 'Chores';
    const listName = 'TODO';

    test.beforeEach(async ({ request, getStartedPage }) => {
        await request.post('http://localhost:3000/api/reset');
        await getStartedPage.load();
        await getStartedPage.createFirstBoard(boardName);
    });
```

We need to change it in a few ways.
First, each test cannot clear the entire database.
Instead, each test need to create its own new board.
Each board will need a unique name so that other tests don't accidentally use it.
An easy way to do this is to assign each board a random number.

Second, each test need to load the web app and open the board it created.
That's where the new methods from the `MyBoardsPage` will be called.

Change the code to look like this:

```typescript
    let boardName: string;
    const listName = 'TODO';

    test.beforeEach(async ({ request, myBoardsPage }) => {
        const randomNumber = Math.trunc(Math.random() * 1000000);
        boardName = 'Chores ' + `${randomNumber}`;

        await request.post('http://localhost:3000/api/boards', {data: {name: boardName}});
        await myBoardsPage.load();
        await myBoardsPage.clickBoard(boardName);
    });
```


### Rewriting test cases

Thankfully, the test case steps can remain the same
because the before hook creates a unique board for each test.

The only change we should make is changing one of the test names:
`'should create the first board'` no longer makes sense as a title
because the board being verified may not be the "first" board created.
Let's change it to `'should display the new board'`:

```typescript
    test('should display the new board', async ({ boardPage }) => {
        await boardPage.expectNewBoardLoaded(boardName);
    });
```

In theory, we could also delete the `tests/pages/get-started.ts` file
and remove it from `tests/fixtures/trello-test.ts` since it is no longer used.


## Running the tests at scale

Rerun the tests in parallel with the updated code:

```
npx playwright test tests/trello.spec.ts
```

Not only will Playwright tests across multiple workers,
it will also run tests across all three browsers (Chromium, Firefox, and WebKit).

When running tests in parallel, watch out for strange, intermittent failures.
Those indicate when collisions are happening.

Another factor to consider is database cleanup.
With the data strategy we chose, tests will continue to add more and more boards.
Eventually, the database should be reset,
or else it could cripple the app or the machine running the app.
Database reset should be done every so often outside of the test automation code.
