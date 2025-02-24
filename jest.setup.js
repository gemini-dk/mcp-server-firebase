process.env.SERVICE_ACCOUNT_KEY_PATH = path.resolve(process.cwd(), 'serviceAccountKey.json');

global.console = {
  ...console,
  log: jest.fn((message) => process.stdout.write(message + '\\n')),
  info: jest.fn((message) => process.stdout.write(message + '\\n')),
  warn: jest.fn((message) => process.stdout.write(message + '\\n')),
  error: jest.fn((message) => process.stderr.write(message + '\\n')),
};
