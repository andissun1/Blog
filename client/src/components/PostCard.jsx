import styled from 'styled-components';
import { Icon } from './Icon';
import { Link } from 'react-router';
import { getDate } from '../utils/getDate';

const PostCardContainer = ({ className, post }) => {
  return (
    <div className={`${className}`}>
      <Link to={`/post/${post.id}`}>
        <img src={post.image_URL} alt="" />
        <div className="card__postInfo">
          <h3 className="title">{post.title}</h3>
          {post.preview && <p>{post.preview}</p>}
          <div className="card__footer">
            <div className="published_at">{getDate(post.published_at)}</div>
            <div className="card__commentsCount">
              <Icon id="fa fa-comment-o" size={'18px'} margin={'0 5px'} />
              {post.comments.length}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const PostCard = styled(PostCardContainer)`
box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
position: relative;
border-radius: 10px;
overflow: hidden;
width: 100%;
max-width: 360px;

  .title {
    margin: 0px;
    text-align: left;
  }

   img {
    display: block;
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

   .card__postInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    gap: 10px;
    height: calc(100% - 180px);
    box-sizing: border-box;

  }

  p {
  display: block;
margin: 0;
}

   .card__footer {
    display: flex;
    justify-content: space-between;

  }

   .published_at,
  .card__commentsCount {
    display: flex;
    align-items: baseline;
    margin-top: auto;
  }

  ${({ isPoster }) => {
    if (isPoster)
      return `
    margin: 0 auto;
    background-color: #f5f5f5;
    border-radius: 10px;
    border: none;
    overflow: hidden;
    max-width: 744px;
    max-height: 396px;

    p {
    display: none;
    }

    img {
     z-index: -1;
     height: 100%;
     width: 100%;
    }

    .card__commentsCount {
    display: none;
    }

    .card__postInfo  {
    position: absolute;
    height: auto;
    bottom: 24px;
    left: 22px;
    
    .title {
    font-size: 32px;
    }

    & * {
    color: #fff;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    }
    }
    `;
  }}};
`;
