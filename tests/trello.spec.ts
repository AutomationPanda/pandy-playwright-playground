// import { test, expect } from '@playwright/test';

// test.beforeAll(async ({ request }) => {

//     // Clear the database
//     await request.post('http://localhost:3000/api/reset');
// });

// test('Create a new board with a list and cards', async ({ page }) => {

//     // Load the app
//     await page.goto('http://localhost:3000/');
    
//     // Create a new board
//     await page.getByPlaceholder('Name of your first board').fill('Chores');
//     await page.getByPlaceholder('Name of your first board').press('Enter');
//     await expect(page.locator('[name="board-title"]')).toHaveValue('Chores');
//     await expect(page.getByPlaceholder('Enter list title...')).toBeVisible();
//     await expect(page.locator('[data-cy="list"]')).not.toBeVisible();

//     // Create a new list
//     await page.getByPlaceholder('Enter list title...').fill('TODO');
//     await page.getByPlaceholder('Enter list title...').press('Enter');
//     await expect(page.locator('[data-cy="list-name"]')).toHaveValue('TODO');

//     // Add cards to the list
//     await page.getByText('Add another card').click();
//     await page.getByPlaceholder('Enter a title for this card...').fill('Buy groceries');
//     await page.getByRole('button', { name: 'Add card' }).click();
//     await page.getByPlaceholder('Enter a title for this card...').fill('Mow the lawn');
//     await page.getByRole('button', { name: 'Add card' }).click();
//     await page.getByPlaceholder('Enter a title for this card...').fill('Walk the dog');
//     await page.getByRole('button', { name: 'Add card' }).click();
//     await expect(page.locator('[data-cy="card-text"]')).toHaveText(
//         ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    
//     // Navigate to the home page
//     await page.getByRole('navigation').getByRole('button').click();
//     await expect(page.getByText('My Boards')).toBeVisible();
//     await expect(page.getByText('Chores')).toBeVisible();
// });



// import { test, expect } from './fixtures/trello-test';

// test.beforeAll(async ({ request }) => {

//     // Clear the database
//     await request.post('http://localhost:3000/api/reset');
// });

// test('Create a new board with a list and cards', async (
//     { getStartedPage, boardPage, myBoardsPage }) => {

//     // Load the app
//     await getStartedPage.load();
    
//     // Create a new board
//     await getStartedPage.createFirstBoard('Chores');
//     await boardPage.expectNewBoardLoaded('Chores');

//     // Create a new list
//     await boardPage.addList('TODO');
//     await expect(boardPage.listName).toHaveValue('TODO');

//     // Add cards to the list
//     await boardPage.addCardToList(0, 'Buy groceries');
//     await boardPage.addCardToList(0, 'Mow the lawn');
//     await boardPage.addCardToList(0, 'Walk the dog');
//     await expect(boardPage.cardTexts).toHaveText(
//         ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
    
//     // Navigate to the home page
//     await boardPage.goHome();
//     await myBoardsPage.expectLoaded(['Chores']);
// });



// import { test, expect } from './fixtures/trello-test';

// test.describe('Trello-like board', () => {
//     const boardName = 'Chores';
//     const listName = 'TODO';

//     test.beforeEach(async ({ request, getStartedPage }) => {
//         await request.post('http://localhost:3000/api/reset');
//         await getStartedPage.load();
//         await getStartedPage.createFirstBoard(boardName);
//     });
    
//     test('should create the first board', async ({ boardPage }) => {
//         await boardPage.expectNewBoardLoaded(boardName);
//     });

//     test('should create the first list in a board', async ({ boardPage }) => {
//         await boardPage.addList(listName);
//         await expect(boardPage.listName).toHaveValue(listName);
//     });

//     test('should create a list with multiple cards', async ({ boardPage }) => {
//         await boardPage.addList(listName);
//         await boardPage.addCardToList(0, 'Buy groceries');
//         await boardPage.addCardToList(0, 'Mow the lawn');
//         await boardPage.addCardToList(0, 'Walk the dog');
//         await expect(boardPage.cardTexts).toHaveText(
//             ['Buy groceries', 'Mow the lawn', 'Walk the dog']);
//     });

//     test('should navigate home from a board', async ({ boardPage, myBoardsPage }) => {
//         await boardPage.goHome();
//         await myBoardsPage.expectLoaded([boardName]);
//     });
// });



import { test, expect } from './fixtures/trello-test';

test.describe('Trello-like board', () => {
    let boardName: string;
    const listName = 'TODO';

    test.beforeEach(async ({ request, myBoardsPage }) => {
        const randomNumber = Math.trunc(Math.random() * 1000000);
        boardName = 'Chores ' + `${randomNumber}`;

        await request.post('http://localhost:3000/api/boards', {data: {name: boardName}});
        await myBoardsPage.load();
        await myBoardsPage.openBoard(boardName);
    });
    
    test('should display the new board', async ({ boardPage }) => {
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
