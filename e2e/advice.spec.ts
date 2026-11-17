import { expect, test } from '@playwright/test'
import type { SavedAdvice } from '../src/types/advice'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/owl', route => route.fulfill({
    json: { advice: route.request().postDataJSON().question ? 'Не спеши' : 'Сова ждет вопрос' },
  }))
  await page.route('https://api.kanye.rest/**', route => route.fulfill({ json: { quote: 'Believe in yourself' } }))
})

test('Пустой вопрос показывает ошибку', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Получить пернатый совет' }).click()
  await expect(page.getByRole('alert')).toHaveText('Сначала напиши вопрос!')
})

test('Совет сохраняется и появляется в копилке', async ({ page }) => {
  const saved: SavedAdvice[] = []
  await page.route('**/api/saved', async route => {
    if (route.request().method() === 'POST') {
      const advice: SavedAdvice = { ...route.request().postDataJSON(), id: '1' }
      saved.push(advice)
      await route.fulfill({ json: advice })
    } else {
      await route.fulfill({ json: saved })
    }
  })
  await page.goto('/')
  await page.getByLabel('Что тебя озадачило?').fill('Как подготовиться к защите?')
  await page.getByRole('button', { name: 'Получить пернатый совет' }).click()
  const owl = page.locator('.result-owl')
  await expect(owl.getByRole('blockquote')).toHaveText('Не спеши')
  await owl.getByRole('button', { name: 'В копилку' }).click()
  await expect(owl.getByRole('button', { name: 'Сохранено', exact: true })).toBeDisabled()
  await page.getByRole('link', { name: 'Копилка', exact: true }).click()
  await expect(page.locator('.saved-page').getByRole('blockquote')).toHaveText('Не спеши')
})

test('Неверный лимит скрывает советы, исправление возвращает их', async ({ page }) => {
  await page.route('**/api/saved', route => route.fulfill({
    json: [{ id: '1', source: 'owl', text: 'Отдохни' }],
  }))
  await page.goto('/saved')
  await expect(page.getByRole('blockquote')).toHaveText('Отдохни')
  const limit = page.getByRole('spinbutton')
  await limit.fill('0')
  await expect(page.getByRole('alert')).toHaveText('Введи целое число от 1 до 50.')
  await expect(page.getByRole('blockquote')).toHaveCount(0)
  await limit.fill('1')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('blockquote')).toHaveText('Отдохни')
})
