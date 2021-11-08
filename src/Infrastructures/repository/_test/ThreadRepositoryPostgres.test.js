const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
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
});
