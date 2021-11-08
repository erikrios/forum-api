const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added thread correctly', async () => {
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

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
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

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'new comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyUserComment', () => {
    it('should throw NotFoundError when comment with given id not found', async () => {
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

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      // Action
      await expect(commentRepositoryPostgres.verifyUserComment('user-123', 'comment-456'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when comment deleted by non owner', async () => {
      // Arrange
      // Owner user
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'password',
        fullname: 'dicoding indonesia',
        username: 'dicoding',
      });

      // Non-owner user
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        password: 'erikpassword',
        fullname: 'erik_indonesia',
        username: 'erik',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      // Action
      await expect(commentRepositoryPostgres.verifyUserComment('user-456', 'comment-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment deleted by the owner', async () => {
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

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyUserComment('user-123', 'comment-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should set is_delete to true', async () => {
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

      const newComment = new NewComment(
        'user-123',
        'thread-123',
        {
          content: 'new comment',
        },
      );

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      // Action
      await commentRepositoryPostgres.deleteComment('user-123', 'thread-123', 'comment-123');
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(comments[0].is_delete).toBeTruthy();
    });
  });
});
