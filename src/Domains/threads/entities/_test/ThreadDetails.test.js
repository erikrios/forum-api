const ThreadDetails = require('../ThreadDetails');
const CommentDetails = require('../../../comments/entities/CommentDetails');

describe('an ThreadDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:19:09.775Z',
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'thread title',
      body: true,
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: {},
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new CommentDetails({
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        }),
        new CommentDetails({
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        }),
      ],
    };

    // Action
    const threadDetails = new ThreadDetails(payload);

    // Assert
    expect(threadDetails.id).toEqual(payload.id);
    expect(threadDetails.title).toEqual(payload.title);
    expect(threadDetails.body).toEqual(payload.body);
    expect(threadDetails.date).toEqual(payload.date);
    expect(threadDetails.username).toEqual(payload.username);
    expect(threadDetails.comments.length).toEqual(payload.comments.length);
    expect(threadDetails.comments.length).toEqual(2);
    expect(threadDetails.comments[0]).toStrictEqual(payload.comments[0]);
    expect(threadDetails.comments[1]).toStrictEqual(payload.comments[1]);
  });
});
