import { expect } from '@playwright/test';
import { Given } from './fixtures2';

Given('step 2', async ({ option2 }) => {
  expect(option2).toEqual('bar');
});
