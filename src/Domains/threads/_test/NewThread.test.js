const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when userId is invalid', () => {
    // Arrange
    const userId = '';
    const payload = {
      title: 'abc',
      body: 'def',
    };

    // Action and Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId did not meet data type specification', () => {
    // Arrange
    const userId = 123;
    const payload = {
      title: 'abc',
      body: 'def',
    };

    // Action and Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-xxx';
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const userId = 'user-xxx';
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const expectedUserId = 'user-xxx';
    const payload = {
      title: 'abc',
      body: 'def',
    };

    // Action
    const { userId, title, body } = new NewThread(expectedUserId, payload);

    // Assert
    expect(userId).toEqual(expectedUserId);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
