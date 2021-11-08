const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when threadId is invalid', () => {
    // Arrange
    const threadId = '';
    const payload = {
      content: 'new comment',
    };

    // Action and Assert
    expect(() => new NewComment(threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId did not meet data type specification', () => { // Arrange
    const threadId = 123;
    const payload = {
      content: 'new comment',
    };

    // Action and Assert
    expect(() => new NewComment(threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const threadId = 'thread-xxx';
    const payload = {};

    // Action and Assert
    expect(() => new NewComment(threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const threadId = 'thread-xxx';
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new NewComment(threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const expectedThreadId = 'thread-xxx';
    const payload = {
      content: 'new comment',
    };

    // Action
    const { threadId, content } = new NewComment(expectedThreadId, payload);

    // Assert
    expect(threadId).toEqual(expectedThreadId);
    expect(content).toEqual(payload.content);
  });
});
