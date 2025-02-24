import { getUserByIdOrEmail } from '../authClient';

const testEmail = 'test@example.com';
const testId = 'testid';

describe('getUserByIdOrEmail', () => {
  it('should return user data when a valid UID is provided', async () => {
    const result = await getUserByIdOrEmail(testId);
    expect(result.content[0].text).toContain(testId);
    expect(result.content[0].text).toContain(testEmail);
    console.log(result.content[0].text);
  });

  it('should return user data when a valid email is provided', async () => {
    const result = await getUserByIdOrEmail(testEmail);
    expect(result.content[0].text).toContain(testId);
    expect(result.content[0].text).toContain(testEmail);
    console.log(result.content[0].text);
  });
});
