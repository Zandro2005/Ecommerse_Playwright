export const validLoginCases = [
  {
    name: 'standard user',
    username: process.env.TEST_USERNAME!,
    password: process.env.TEST_PASSWORD!,
  },
];

export const invalidLoginCases = [
  {
    name: 'Invalid username',
    username: 'Unknown_Username',
    password: process.env.TEST_PASSWORD!,
    expectedError: 'Username and password do not match',
  },

  {
    name: 'Invalid password',
    username: process.env.TEST_USERNAME!,
    password: 'Invalid_Password',
    expectedError: 'Username and password do not match',
  },

  {
    name: 'Locked-out user',
    username: 'locked_out_user',
    password: process.env.TEST_PASSWORD!,
    expectedError: 'Sorry, this user has been locked out',
  },

  {
    name: 'Empty username',
    username: '',
    password: process.env.TEST_PASSWORD!,
    expectedError: 'Username is required',
  },

  {
    name: 'Empty password',
    username: process.env.TEST_USERNAME!,
    password: '',
    expectedError: 'Password is required',
  },

  {
    name: 'Empty username and password',
    username: '',
    password: '',
    expectedError: 'Username is required',
  },

  {
    name: 'Username is case-sensitive',
    username: 'STANDARD_USER',
    password: process.env.TEST_PASSWORD!,
    expectedError: 'Username and password do not match',
  },
];
