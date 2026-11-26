import { test, expect } from '@playwright/test';

const FIXTURE = '/test/questionaire-container-height.test.html';

async function setup(page) {
  await page.goto(FIXTURE);
  // Wait until the custom element is upgraded and has finished its first render.
  await page.waitForFunction(
    () => customElements.get('questionaire-container') !== undefined
  );
  await page.waitForSelector('questionaire-container[ready="1"]');
}

function getHeight(page, expr) {
  return page.evaluate(expr);
}

test.describe('questionaire-container height management', () => {
  test('container height fits the current slide instead of the tallest slide', async ({ page }) => {
    await setup(page);

    const heights = await page.evaluate(() => {
      const container = document.getElementById('q');
      return {
        container: container.getBoundingClientRect().height,
        slide1: document.getElementById('slide1').getBoundingClientRect().height,
        slide2: document.getElementById('slide2').getBoundingClientRect().height,
      };
    });

    // Sanity: the tallest slide is indeed much taller than the first one.
    expect(heights.slide2).toBeGreaterThan(heights.slide1 + 100);

    // Regression: the container used to reserve the height of the tallest
    // slide (slide2) for every step of the carousel, leaving a large blank
    // band below the current slide.
    expect(heights.container).toBeGreaterThan(heights.slide1 - 3);
    expect(heights.container).toBeLessThan(heights.slide1 + 3);
    expect(heights.container).toBeLessThan(heights.slide2 - 50);
  });

  test('container height follows slide navigation', async ({ page }) => {
    await setup(page);

    // next() -> slide2 (the tall one)
    await page.evaluate(() => document.getElementById('q').next());
    await page.waitForTimeout(400); // transform/height transition: 0.3s
    let height = await getHeight(page, () =>
      document.getElementById('q').getBoundingClientRect().height
    );
    expect(height).toBeGreaterThan(497);
    expect(height).toBeLessThan(503);

    // goToSlide() -> slide3 (the short one)
    await page.evaluate(() => document.getElementById('q').goToSlide(2));
    await page.waitForTimeout(400);
    height = await getHeight(page, () =>
      document.getElementById('q').getBoundingClientRect().height
    );
    expect(height).toBeGreaterThan(97);
    expect(height).toBeLessThan(103);

    // previous() -> back to slide2
    await page.evaluate(() => document.getElementById('q').previous());
    await page.waitForTimeout(400);
    height = await getHeight(page, () =>
      document.getElementById('q').getBoundingClientRect().height
    );
    expect(height).toBeGreaterThan(497);
  });

  test('container height adapts when the current slide content resizes', async ({ page }) => {
    await setup(page);

    await page.evaluate(() => {
      document.getElementById('slide1').style.height = '350px';
    });
    // Allow the ResizeObserver to fire and the height transition to settle.
    await page.waitForTimeout(400);

    const height = await getHeight(page, () =>
      document.getElementById('q').getBoundingClientRect().height
    );
    expect(height).toBeGreaterThan(347);
    expect(height).toBeLessThan(353);
  });
});
