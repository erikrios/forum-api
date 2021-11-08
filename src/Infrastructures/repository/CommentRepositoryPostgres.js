const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { userId, threadId, content } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, content, owner, thread_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(userId, threadId, commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = 'true' WHERE id = $1 AND owner = $2 AND thread_id = $3",
      values: [commentId, userId, threadId],
    };

    await this._pool.query(query);
  }

  async verifyUserComment(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`Comment with id ${commentId} not found.`);
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('This resource is restricted to access.');
    }
  }
}

module.exports = CommentRepositoryPostgres;
