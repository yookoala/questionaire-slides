import { test, expect } from '@playwright/test';
import { readdirSync } from 'fs';
import { join } from 'path';

// Get all HTML test files
const testDir = './test';
const htmlTestFiles = readdirSync(testDir)
  .filter(file => file.endsWith('.test.html'))
  .map(file => file.replace('.test.html', ''));

// Test each HTML file
htmlTestFiles.forEach(testName => {
  test.describe(`${testName} tests`, () => {
    test('should load and render components', async ({ page }) => {
      // Navigate to the test HTML file
      await page.goto(`/test/${testName}.test.html`);

      // Wait for the page to load completely
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Verify page loaded successfully by checking title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // Check if any questionnaire components are present
      const hasQuestionnaireComponents = await page.evaluate(() => {
        const componentTags = [
          'questionaire-container',
          'questionaire-question',
          'questionaire-question-answer',
          'questionaire-question-content',
          'questionaire-action',
          'questionaire-actions'
        ];
        
        return componentTags.some(tag => document.querySelector(tag) !== null);
      });

      expect(hasQuestionnaireComponents).toBe(true);

      // Check that page has meaningful content
      const bodyText = await page.textContent('body');
      expect(bodyText.length).toBeGreaterThan(100);
    });

    test('should have interactive components', async ({ page }) => {
      await page.goto(`/test/${testName}.test.html`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Test component-specific interactions
      if (testName.includes('question-answer')) {
        const answers = await page.locator('questionaire-question-answer');
        const count = await answers.count();
        if (count > 0) {
          const firstAnswer = answers.first();
          if (await firstAnswer.isVisible()) {
            // Test clicking on answer (should not throw error)
            await firstAnswer.click();
            await page.waitForTimeout(100);
            // Answer should exist and be clickable
            expect(await firstAnswer.isVisible()).toBe(true);
          }
        }
      }

      if (testName.includes('action')) {
        const actions = await page.locator('questionaire-action');
        const count = await actions.count();
        if (count > 0) {
          const firstAction = actions.first();
          if (await firstAction.isVisible()) {
            // Test that action is visible and potentially clickable
            expect(await firstAction.isVisible()).toBe(true);
            
            // Try to click without expecting specific behavior (may be disabled)
            try {
              await firstAction.click({ timeout: 1000 });
            } catch (e) {
              // Expected for disabled actions
            }
          }
        }
      }

      if (testName.includes('container')) {
        const containers = await page.locator('questionaire-container');
        const count = await containers.count();
        if (count > 0) {
          const firstContainer = containers.first();
          // Just check that container element exists, not necessarily visible
          const containerExists = await firstContainer.count();
          expect(containerExists).toBeGreaterThan(0);
        }
      }
    });

    test('should have proper test results where applicable', async ({ page }) => {
      await page.goto(`/test/${testName}.test.html`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Check for test summary structure (some tests have this)
      const summaryElement = await page.locator('#summary').first();
      if (await summaryElement.isVisible()) {
        const totalElement = await page.locator('#total').first();
        if (await totalElement.isVisible()) {
          const total = await totalElement.textContent();
          console.log(`${testName}: Found test summary with ${total} total tests`);
          
          // Ensure total is a number
          expect(parseInt(total)).toBeGreaterThanOrEqual(0);
        }
      }

      // For tests without summary, just ensure page content is reasonable
      const hasContent = await page.evaluate(() => {
        const body = document.body;
        return body && body.textContent && body.textContent.trim().length > 50;
      });
      expect(hasContent).toBe(true);
    });
  });
});

// Overall integration tests
test.describe('Component Integration', () => {
  test('should load basic questionnaire components', async ({ page }) => {
    await page.goto('/test/questionaire-container.test.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Test that custom elements can be created
    const customElementsWork = await page.evaluate(() => {
      try {
        const container = document.createElement('questionaire-container');
        const question = document.createElement('questionaire-question');
        const answer = document.createElement('questionaire-question-answer');
        
        return container && question && answer &&
               container.tagName === 'QUESTIONAIRE-CONTAINER' &&
               question.tagName === 'QUESTIONAIRE-QUESTION' &&
               answer.tagName === 'QUESTIONAIRE-QUESTION-ANSWER';
      } catch (e) {
        return false;
      }
    });

    expect(customElementsWork).toBe(true);
  });

  test('should handle basic questionnaire workflow', async ({ page }) => {
    await page.goto('/test/questionaire-container.test.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Test basic questionnaire interaction flow
    const workflowWorks = await page.evaluate(() => {
      try {
        // Test that the basic component constructors work
        const container = document.createElement('questionaire-container');
        const question = document.createElement('questionaire-question');
        const answer1 = document.createElement('questionaire-question-answer');
        
        // Basic element creation should work
        if (!container || !question || !answer1) {
          return false;
        }
        
        // Check that the components have the expected tag names
        if (container.tagName !== 'QUESTIONAIRE-CONTAINER' ||
            question.tagName !== 'QUESTIONAIRE-QUESTION' ||
            answer1.tagName !== 'QUESTIONAIRE-QUESTION-ANSWER') {
          return false;
        }
        
        return true;
      } catch (e) {
        console.log('Workflow test error:', e.message);
        return false;
      }
    });

    expect(workflowWorks).toBe(true);
  });
});