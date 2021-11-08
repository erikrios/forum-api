const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'password',
        fullname: 'dicoding indonesia',
        username: 'dicoding',
      });

      const newThread = new NewThread(
        'user-123',
        {
          title: 'thread title',
          body: 'thread body',
        },
      );

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'password',
        fullname: 'dicoding indonesia',
        username: 'dicoding',
      });

      const newThread = new NewThread(
        'user-123',
        {
          title: 'thread title',
          body: 'thread body',
        },
      );

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('isThreadExists function', () => {
    it('should throw error when given thread id not found', async () => {
      // Arrange
      const threadId = 'thread-456';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action and assert
      await expect(threadRepositoryPostgres.isThreadExists(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw error when given thread id is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'password',
        fullname: 'dicoding indonesia',
        username: 'dicoding',
      });

      const newThread = new NewThread(
        'user-123',
        {
          title: 'thread title',
          body: 'thread body',
        },
      );

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      await expect(threadRepositoryPostgres.isThreadExists('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should return thread details correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'password',
        fullname: 'dicoding indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment('comment-123', 'user-123', 'thread-123', 'my comment');

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetails = await threadRepositoryPostgres.getThread('thread-123');
      // Assert
      expect(threadDetails.id).toEqual('thread-123');
      expect(threadDetails.title).toEqual('thread title');
      expect(threadDetails.body).toEqual('thread body');
      expect(threadDetails.date).toBeTruthy();
      expect(threadDetails.username).toEqual('dicoding');
      expect(threadDetails.comments).toHaveLength(1);
    });
  });
});
