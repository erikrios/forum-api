class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadRepository.isThreadExists(threadId);
    await this._commentRepository.verifyUserComment(userId, commentId);
    await this._commentRepository.deleteComment(userId, threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
