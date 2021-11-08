class NewComment {
  constructor(threadId, payload) {
    this._verifyThreadId(threadId);
    this._verifyPayload(payload);

    const { content } = payload;

    this.threadId = threadId;
    this.content = content;
  }

  _verifyThreadId(threadId) {
    if (!threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
