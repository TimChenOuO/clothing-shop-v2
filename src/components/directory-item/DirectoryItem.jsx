import { useNavigate } from 'react-router-dom';

import { BackgroundImage, Body, DirectoryItemCotainer } from './directoryItem.styles.jsx';

const DirectoryItem = ({ category }) => {
  const { imageUrl, title, route } = category;
  const navigate = useNavigate();

  const onNavigateHandle = () => navigate(route);

  return (
    <DirectoryItemCotainer
      onClick={onNavigateHandle}
    >
      <BackgroundImage imageurl={imageUrl} />
      <Body>
        <h2>{title}</h2>
        <p>Shop Now</p>
      </Body>
    </DirectoryItemCotainer>
  );
};

export default DirectoryItem;
