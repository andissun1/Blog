import styled from 'styled-components';
import { H2 } from './H2';
import { Icon } from './Icon';

const PostContentContainer = ({
  id,
  title,
  image_URL,
  content,
  published_at,
  className,
}) => {
  return (
    <div className={className}>
      {image_URL && <img src={image_URL} />}
      <H2>{title}</H2>
      <div className="controlPanel">
        <div>
          <Icon id="fa fa-calendar-o" size={'18px'} /> {published_at}
        </div>
        <div>
          <button>
            <Icon id="fa fa-pencil-square-o" size={'21px'} />
          </button>
          <button>
            <Icon id="fa fa-trash-o" size={'21px'} />
          </button>
        </div>
      </div>
      <div className="">{content}</div>
    </div>
  );
};

export const PostContent = styled(PostContentContainer)``;
