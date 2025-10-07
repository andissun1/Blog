import styled from 'styled-components';
import { Icon } from './Icon';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const PostCardContainer = ({ className, post }) => {
  return (
    <div className={className}>
      <Link to={`/post/${post.id}`}>
        <img src={post.image_URL} alt="" />
        <div className="card__postInfo">
          <h3 className="title">{post.title}</h3>
          <div className="card__footer">
            <div className="published_at">
              <Icon id="fa fa-calendar-o" size={'18px'} margin={'0 5px'} />{' '}
              {post.published_at}
            </div>
            <div className="card__commentsCount">
              <Icon id="fa fa-comment-o" size={'18px'} margin={'0 5px'} />
              {post.commentsCount}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const PostCard = styled(PostCardContainer)`
  border: 1px solid black;

  & .title {
    margin: 10px;
    text-align: left;
  }

  & img {
    display: block;
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  & .card__postInfo {
    display: flex;
    flex-direction: column;
  }

  & .card__footer {
    display: flex;
    justify-content: space-between;
    margin: 0 10px 10px 10px;
  }

  & .published_at,
  .card__commentsCount {
    display: flex;
    align-items: baseline;
  }
`;

PostCard.propTypes = {
  post: PropTypes.object,
};
