class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExists(threadId);
    const threadDetails = await this._threadRepository.getThread(threadId);
    threadDetails.comments.forEach((part, index, commentArrays) => {
      if (part.isDelete) {
        commentArrays[index].content = '**komentar telah dihapus**';
      }
      delete commentArrays[index].isDelete;
    });

    return threadDetails;
  }
}

module.exports = GetThreadUseCase;
