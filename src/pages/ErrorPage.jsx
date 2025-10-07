import { useSelector } from 'react-redux';
import styled from 'styled-components';

const ErrorPageContainer = ({ className }) => {
  const postErrors = useSelector((store) => store.post.postErrors);
  const commentsErrors = useSelector((store) => store.post.commentsErrors);
  const accessErrors = useSelector((store) => store.app.accessErrors);

  const errors = postErrors || commentsErrors || accessErrors || 'Страница не найдена';

  return (
    <div className={className}>
      <h2>{errors}</h2>
    </div>
  );
};

export const ErrorPage = styled(ErrorPageContainer)``;
