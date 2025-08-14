import { type Page } from '@playwright/test';

export const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

export async function createDefaultTodos(page: Page): Promise<void> {
  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}

export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number): Promise<void> {
  await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}

export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number): Promise<void> {
  await page.waitForFunction(e => {
    const items: { completed: boolean }[] = JSON.parse(localStorage['react-todos']);
    return items.filter((i) => i.completed).length === e;
  }, expected);
}

export async function checkTodosInLocalStorage(page: Page, title: string): Promise<void> {
  await page.waitForFunction(t => {
    const items: { title: string }[] = JSON.parse(localStorage['react-todos']);
    return items.map((i) => i.title).includes(t);
  }, title);
}
