import { test, expect } from '@playwright/test';

test('Create a new board with a list and cards', async ({ page }) => {

    // Load the app
    await page.goto('http://localhost:3000/');
    
    // Create a new board
    await page.getByPlaceholder('Name of your first board').click();
    await page.getByPlaceholder('Name of your first board').fill('Chores');
    await page.getByPlaceholder('Name of your first board').press('Enter');

    // Create a new list
    await page.getByPlaceholder('Enter list title...').click();
    await page.getByPlaceholder('Enter list title...').fill('TODO');
    await page.getByPlaceholder('Enter list title...').press('Enter');

    // Add cards to the list
    await page.getByText('Add another card').click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Buy groceries');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Mow the lawn');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Walk the dog');
    await page.getByRole('button', { name: 'Add card' }).click();
    
    // Navigate to the home page
    await page.getByRole('navigation').getByRole('button').click();
});