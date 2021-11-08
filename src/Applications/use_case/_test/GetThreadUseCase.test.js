const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const expectedThread = new ThreadDetails({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: 'thread-date',
      username: 'dicoding',
      comments: [
        new CommentDetails({
          id: 'comment-123',
          username: 'johndoe',
          date: 'comment-date',
          content: 'my content',
          isDelete: false,
        }),
        new CommentDetails({
          id: 'comment-456',
          username: 'dicoding',
          date: 'comment-date',
          content: 'my content',
          isDelete: true,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.isThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetails = await getThreadUseCase.execute('thread-123');

    // Expect
    expect(threadDetails).toStrictEqual(expectedThread);
    expect(mockThreadRepository.isThreadExists).toBeCalled();
    expect(mockThreadRepository.getThread).toBeCalledWith('thread-123');
  });
});
