const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCaseUserId = 'user-xxx';
    const useCasePayload = {
      title: 'abc',
      body: 'def',
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-xxx',
      title: useCasePayload.title,
      owner: useCaseUserId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    //** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCaseUserId, useCasePayload);

    // Expect
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCaseUserId, {
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
