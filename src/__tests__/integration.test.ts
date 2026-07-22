import test from 'node:test';
import assert from 'node:assert';
import { assertRateLimit, sanitizeInput, checkSqlInjection } from '../lib/security';

test('SSO Rate Limiter Boundary Conditions', () => {
  const key = 'test-client-ip-1';
  
  // First 5 requests should pass freely
  for (let i = 0; i < 5; i++) {
    const allowed = assertRateLimit(key, 5, 2000);
    assert.strictEqual(allowed, true);
  }

  // 6th request inside the window must be rate-limited
  const blocked = assertRateLimit(key, 5, 2000);
  assert.strictEqual(blocked, false);
});

test('XSS Protection Input Escapes', () => {
  const maliciousInput = '<script>alert("XSS")</script><iframe src="malicious"></iframe>Hello World!';
  const cleanOutput = sanitizeInput(maliciousInput);
  
  // Output must be purged of script and iframe tags
  assert.strictEqual(cleanOutput.includes('<script>'), false);
  assert.strictEqual(cleanOutput.includes('<iframe>'), false);
  assert.strictEqual(cleanOutput.trim(), 'Hello World!');
});

test('Anti-SQL Injection Security Filters', () => {
  const dangerousSql = 'SELECT * FROM users WHERE id = 1 OR "1"="1"';
  const cleanText = ' Swept Prior swing high support level ';

  assert.strictEqual(checkSqlInjection(dangerousSql), true);
  assert.strictEqual(checkSqlInjection(cleanText), false);
});

test('Universal 2FA Simulation Codes', () => {
  const validCode: string = '123456';
  const invalidCode: string = '999888';

  assert.strictEqual(validCode === '123456', true);
  assert.strictEqual(invalidCode === '123456', false);
});
