# Chapter 5: Breaking down tests by behaviors

In this chapter,
we will break down the test we wrote in the previous chapter
by separating unique behaviors into independent, atomic tests.


## Identifying unique behaviors

Currently, we have one test that performs 5 steps:

1. load the app
2. create a new board
3. create a new list
4. add cards to the list
5. navigate to the home page

Each of these steps covers a unique behavior.
If any one of these behaviors were to fail, it would fail the whole test.
Furthermore, a failure could block features from being covered.
For example, if there is a failure in creating new cards,
then home navigation won't be attempted.
That's not ideal:
each behavior should have its own test to report its own result.

Each one of these behaviors could be its own test.
Each one could also have vectors for related but distinct behaviors as well.
For example, the card behaviors include:

* adding one card
* adding multiple cards
* deleting a card
* editing a card's name
* moving a card to change the order of a list
* moving a card to a different list

All of these behaviors have a common starting point:
There must be a board with a list (or multiple lists).
These tests could share common setup steps.
Other behaviors might need some of the same setup step,
but they might also have other needs.


## Splitting behaviors into separate tests

The more tests we add to our growing suite,
the more important it will become to keep them atomic and independent.
Let's split up the one big test we have into smaller tests
that each cover an individual behavior.


### Test structure

Currently, the `trello-test.ts` module has two definitions:

1. A `test.beforeAll` function that clears the database.
2. A `test` function with the one test case.

We will need to split up the test into multiple tests.
Typically with Playwright, it is good practice to group related tests together
so that they can share common objects and produce hierarchical reporting.

We can group tests together with a `test.describe` definition.
Add one for our new tests:

```typescript
import { test, expect } from './fixtures/trello-test';

test.describe('Trello-like board', () => {
    // ...
});
```

Since our tests will share common names like "Chores" and "TODO",
let's add them as constants inside the `test.describe` block:

```typescript
    const boardName = 'Chores';
    const listName = 'TODO';
```


### Before hooks

We should also transform the setup steps.
Previously, we had a `test.beforeAll` definition that runs one time before *all* tests.
Now, we need setup that runs before *each* test.

Furthermore, we need to do more than just reset the database.
Since each test needs the app to be loaded and for a board to be created,
then we should add those interactions to the common setup.
This will save us the hassle of duplicating steps in each test.

Rewrite the before hook like this, and put it inside the `test.describe` block:

```typescript
    test.beforeEach(async ({ request, getStartedPage }) => {
        await request.post('http://localhost:3000/api/reset');
        await getStartedPage.load();
        await getStartedPage.createFirstBoard(boardName);
    });
```


### Testing board creation

The first test should make sure that creating a new board works properly.
Since the before hook already performed the interaction to create the board,
this test needs only to make the assertions.

Add the following `test` definition inside the `test.describe` definition:

```typescript
    test('should create the first board', async ({ boardPage }) => {
        await boardPage.expectNewBoardLoaded(boardName);
    });
```

It may seem odd to write a test with just an assertion.
Typically, we would want to include the interaction (`getStartedPage.createFirstBoard`)
in the test case body to define interaction plus verification.
However, since the other tests in this set all need a created board as a starting point,
relying on the before hook to create the board is merely a convenience.


### Testing list creation

After creating a new board, the user can create a new list on that board.
Add a test for it like this:

```typescript
    test('should create the first list in a board', async ({ boardPage }) => {
        await boardPage.addList(listName);
        await expect(boardPage.listName).toHaveValue(listName);
    });
```

This test does *not* need to repeat the assertion from the previous test.
Instead, it can focus on the behavior at hand: creating a new list on the board.


### Testing card creation

Card creating can also be tested once a board is created.
Add a test for it like this:

```typescript
    test('should create a list with multiple cards', async ({ boardPage }) => {
        await boardPage.addList(listName);
        await boardPage.addCardToList(0, 'Buy groceries');
        await boardPage.addCardToList(0, 'Mow the lawn');
        await boardPage.addCardToList(0, 'Walk the dog');
        await expect(boardPage.cardTexts).toHaveText(
            ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    });
```

This test does require the creation of a list on the board before cards can be added.


### Testing home navigation

The final test is home navigation.
It doesn't matter what is or isn't on the board:
we can test navigation independently of the lists and cards.
Add a test like this:

```typescript
    test('should navigate home from a board', async ({ boardPage, myBoardsPage }) => {
        await boardPage.goHome();
        await myBoardsPage.expectLoaded([boardName]);
    });
```


### Rerunning the final code

The final test code should look like this:

```typescript
import { test, expect } from './fixtures/trello-test';

test.describe('Trello-like board', () => {
    const boardName = 'Chores';
    const listName = 'TODO';

    test.beforeEach(async ({ request, getStartedPage }) => {
        await request.post('http://localhost:3000/api/reset');
        await getStartedPage.load();
        await getStartedPage.createFirstBoard(boardName);
    });
    
    test('should create the first board', async ({ boardPage }) => {
        await boardPage.expectNewBoardLoaded(boardName);
    });

    test('should create the first list in a board', async ({ boardPage }) => {
        await boardPage.addList(listName);
        await expect(boardPage.listName).toHaveValue(listName);
    });

    test('should create a list with multiple cards', async ({ boardPage }) => {
        await boardPage.addList(listName);
        await boardPage.addCardToList(0, 'Buy groceries');
        await boardPage.addCardToList(0, 'Mow the lawn');
        await boardPage.addCardToList(0, 'Walk the dog');
        await expect(boardPage.cardTexts).toHaveText(
            ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    });

    test('should navigate home from a board', async ({ boardPage, myBoardsPage }) => {
        await boardPage.goHome();
        await myBoardsPage.expectLoaded([boardName]);
    });
});
```

Run these new tests (`npx playwright test --ui` or `npx playwright test tests/trello.spec.ts --workers 1`)
to make sure they pass.
(If you run them from UI mode, make sure to run them one at a time!)
Again, the coverage is the same as before.
The main benefit is that each unique behavior is tested and reported independently.


## Optimizing setup steps

?

