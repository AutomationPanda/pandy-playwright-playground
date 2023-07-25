# Chapter 4: Refactoring interactions with page objects

In this chapter,
we will refactor interactions with page objects
to make them more readable and more reusable.


## Reviewing interaction code

Let's revisit the test code we wrote in the previous chapter:

```typescript
    // Load the app
    await page.goto('http://localhost:3000/');
    
    // Create a new board
    await page.getByPlaceholder('Name of your first board').fill('Chores');
    await page.getByPlaceholder('Name of your first board').press('Enter');
    await expect(page.locator('[name="board-title"]')).toHaveValue('Chores');
    await expect(page.getByPlaceholder('Enter list title...')).toBeVisible();
    await expect(page.locator('[data-cy="list"]')).not.toBeVisible();

    // Create a new list
    await page.getByPlaceholder('Enter list title...').fill('TODO');
    await page.getByPlaceholder('Enter list title...').press('Enter');
    await expect(page.locator('[data-cy="list-name"]')).toHaveValue('TODO');

    // Add cards to the list
    await page.getByText('Add another card').click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Buy groceries');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Mow the lawn');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Walk the dog');
    await page.getByRole('button', { name: 'Add card' }).click();
    await expect(page.locator('[data-cy="card-text"]')).toHaveText(
        ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    
    // Navigate to the home page
    await page.getByRole('navigation').getByRole('button').click();
    await expect(page.getByText('My Boards')).toBeVisible();
    await expect(page.getByText('Chores')).toBeVisible();
```

Upon close review, we can see lots of code duplication around locators.
The following locators are copied more than once:

* `page.getByPlaceholder('Name of your first board')`
* `page.getByPlaceholder('Enter list title...')`
* `page.getByPlaceholder('Enter a title for this card...')`

The code is also rather verbose.
Each step has multiple lines, and each line is a chain of calls.
These factors make the test code arguably
difficult to read, difficult to understand, and difficult to maintain.
It also does not help us write new tests that could use the same parts.

One common pattern for automating interactions is the [Page Object Model](https://playwright.dev/docs/pom).
A *page object* models a web page (or part of a web page).
It is typically implemented as a class with locators for important elements
as well as interaction methods that use those elements.
For example, a login page could have locators for the username and password fields,
and it could have a login method that performs login.
Page objects make interaction code more readable and reusable.
Multiple tests can use the same page objects.


## Creating page object classes

Let's create page objects for each of the pages.


### The Get Started page

The first two test steps interact with the "Get Started!" page.
There are two interactions - loading the page, and entering a new board name:

```typescript
    await page.goto('http://localhost:3000/');

    await page.getByPlaceholder('Name of your first board').fill('Chores');
    await page.getByPlaceholder('Name of your first board').press('Enter');
```

We should create a page object with an interaction method for each.
Create a new folder under the `tests` directory named `pages`,
and create a new file named `get-started.ts`.
Create a new class in this file:

```typescript
import { type Locator, type Page } from '@playwright/test';

export class GetStartedPage {
    // ...
}
```

Page object classes need a reference to the Playwright `Page`,
so add an instance variable for it:

```typescript
    readonly page: Page;
```

Create an instance variable for the one locator needed as well:

```typescript
    readonly firstBoardInput: Locator;
```

Add a constructor to receive the Playwright `Page` and create the locator:

```typescript
    constructor(page: Page) {
        this.page = page;
        this.firstBoardInput = page.getByPlaceholder('Name of your first board');
    }
```

The code for the two interactions are based on the existing test code.
Add a method for loading the page:

```typescript
    async load() {
        await this.page.goto('http://localhost:3000/');
    }
```

Finally, add a method for creating the first board.
Instead of hard-coding the name of the board, parameterize the name.
This makes the method usable for other tests:

```typescript
    async createFirstBoard(name: string) {
        await this.firstBoardInput.fill(name);
        await this.firstBoardInput.press('Enter');
    }
```

The locator object `firstBoardInput` avoids selector duplication,
and it makes these lines focus more on the *intention* of the interactions than their *implementation*.

Now, the test code can be rewritten this page object like this:

```typescript
    const getStartedPage = new GetStartedPage(page);

    await getStartedPage.load();
    await getStartedPage.createFirstBoard('Chores');
```

This code is much more readable and understandable.
We will rewrite the test case code a little later.


### The Board page

Most of the interactions happen on the page for the board after it is created.
Create another file under the `tests/pages` directory named `board.ts`,
and add the following code:

```typescript
import { expect, type Locator, type Page } from '@playwright/test';

export class BoardPage {
    readonly page: Page;
    readonly boardTitle: Locator;
    readonly enterListTitle: Locator;
    readonly boardLists: Locator;
    readonly listName: Locator;
    readonly addAnotherCard: Locator;
    readonly enterCardTitle: Locator;
    readonly addCard: Locator;
    readonly cardTexts: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.boardTitle = page.locator('[name="board-title"]');
        this.enterListTitle = page.getByPlaceholder('Enter list title...');
        this.boardLists = page.locator('[data-cy="list"]');
        this.listName = page.locator('[data-cy="list-name"]');
        this.addAnotherCard = page.getByText('Add another card');
        this.enterCardTitle = page.getByPlaceholder('Enter a title for this card...');
        this.addCard = page.getByRole('button', { name: 'Add card' });
        this.cardTexts = page.locator('[data-cy="card-text"]');
        this.homeButton = page.getByRole('navigation').getByRole('button');
    }

    async expectNewBoardLoaded(name: string) {
        await expect(this.boardTitle).toHaveValue(name);
        await expect(this.enterListTitle).toBeVisible();
        await expect(this.boardLists).not.toBeVisible();
    }

    async addList(name: string) {
        await this.enterListTitle.fill(name);
        await this.enterListTitle.press('Enter');
    }

    async addCardToList(listIndex: number, cardName: string) {
        await this.boardTitle.click();   // defocus
        await this.addAnotherCard.nth(listIndex).click();
        await this.enterCardTitle.fill(cardName);
        await this.addCard.click();
    }

    async goHome() {
        await this.homeButton.click();
    }
}
```

This page object has several locators and four interaction methods.
One of these methods covers assertions: `expectNewBoardLoaded`.
Assertions should always be called explicitly within the test case.
Simple assertions can be made with Playwright's assertion library and don't need dedicated methods.
Complex assertions can be implemented as page object methods
as long as they are clear about making assertions.

Many of the methods are parameterized for reusability.
The `addCardToList` method is the most interesting.
In addition to taking in the name of the card to create,
it also takes in the index of the list to which to add the cards.
Even though our test uses only one list, other tests could use more lists.
To pick the desired list, the `addAnotherCard` locator includes the `nth` method with the list index.


### The My Boards page

The final page is the My Boards page.
The only interaction done with this page is an assertion for key elements on the page.
The assertion is tricky, though, because it should verify that *all* expected boards appear.
That warrants a page object.

Create another file under the `tests/pages` directory named `my-boards.ts`,
and add the following code:

```typescript
import { expect, type Locator, type Page } from '@playwright/test';

export class MyBoardsPage {
  readonly page: Page;
  readonly myBoardsTitle: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.myBoardsTitle = page.getByText('My Boards');
  }

  async expectLoaded(boardNames: string[]) {
    await expect(this.myBoardsTitle).toBeVisible();

    for (const name of boardNames) {
        await expect(this.page.getByText(name)).toBeVisible();
    }
  }
}
```

The `expectLoaded` method takes in a list of strings for board names to check.
It verifies that "My Boards" and each expected board name appears by text.


## Rewriting test case code

Let's rewrite the test case code using these new page objects.
In `trello.spec.ts`, add import statements for the page objects:

```typescript
import { GetStartedPage } from './pages/get-started';
import { BoardPage } from './pages/board';
import { MyBoardsPage } from './pages/my-boards';
```

Inside the test function, construct each page object:

```typescript
    const getStartedPage = new GetStartedPage(page);
    const boardPage = new BoardPage(page);
    const myBoardsPage = new MyBoardsPage(page);
```

Then, rewrite the steps:

```typescript
    // Load the app
    await getStartedPage.load();
    
    // Create a new board
    await getStartedPage.createFirstBoard('Chores');
    await boardPage.expectNewBoardLoaded('Chores');

    // Create a new list
    await boardPage.addList('TODO');
    await expect(boardPage.listName).toHaveValue('TODO');

    // Add cards to the list
    await boardPage.addCardToList(0, 'Buy groceries');
    await boardPage.addCardToList(0, 'Mow the lawn');
    await boardPage.addCardToList(0, 'Walk the dog');
    await expect(boardPage.cardTexts).toHaveText(
        ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    
    // Navigate to the home page
    await boardPage.goHome();
    await myBoardsPage.expectLoaded(['Chores']);
```

This code is much more concise than before!
Future tests can use these page objects as well.


## Rerunning the tests

Rerun the test using either UI mode:

```
npx playwright test --ui
```

Or the command line:

```
npx playwright test tests/trello.spec.ts --workers 1
```

Functionally, the test has not changed.
It should still pass.


## Optional: Creating fixtures for page objects

Constructing page objects in every test function becomes duplicative.
A great way to avoid this duplication is to create a
[fixture](https://playwright.dev/docs/test-fixtures) for each page object class.
Then, each test can receive a reference to any object it declares,
just like the `page` object used for making Playwright interactions.

Follow the [Fixtures](https://playwright.dev/docs/test-fixtures) guide in the Playwright docs
to refactor this test code using fixtures for each page object.
