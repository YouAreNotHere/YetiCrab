import { IAttraction } from '../../shared/types/IAttraction.ts';
import { useRequest } from '../../shared/hooks/useRequest.ts';
import Star from '../../assets/Star.tsx';
import './AttractionItem.scss';
import Cross from '../../assets/Cross.tsx';
import Pen from '../../assets/Pen.tsx';
import AttractionModal from '../AttractionModal/AttractionModal.tsx';
import { Text, Button, Link } from '@gravity-ui/uikit';
import { useState } from 'react';

interface Props {
  attraction: IAttraction;
  attractions: IAttraction[];
  setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
  isAdminMode: boolean;
}

interface Props {
  attraction: IAttraction;
  attractions: IAttraction[];
  setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const AttractionItem = ({
  attraction,
  setAttractions,
  attractions,
  isAdminMode,
}: Props) => {
  const {
    id,
    name,
    description,
    rating: ratingArray,
    photoUrl,
    location,
    addedAt,
    mapLink,
    isVisited,
  } = attraction;

  const [currentRating, setCurrentRating] = useState(0);
  const [focusedRating, setFocusedRating] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);

  const ratingValues = [1, 2, 3, 4, 5];

  const rating =
    ratingArray.length > 0
      ? (ratingArray.reduce((a, c) => a + c, 0) / ratingArray.length).toFixed(2)
      : 'нет оценок';

  const formattedDate = new Date(addedAt).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const { makeRequest: deleteItem } = useRequest({
    method: 'DELETE',
    url: `attractions/${id}`,
  });
  const { makeRequest: selectRating } = useRequest({
    method: 'PUT',
    url: `attractions/${attraction.id}`,
  });
  const { makeRequest: changeIsVisited } = useRequest({
    method: 'PUT',
    url: `attractions/${attraction.id}`,
  });

  const onRatingButtonClick = (number: number) => {
    setCurrentRating(number);
    setFocusedRating(number);
    const formData = new FormData();
    ratingArray.push(number);
    formData.append('rating', JSON.stringify(ratingArray));
    selectRating(formData);
    setIsRatingButtonDisabled(true);
  };

  const onIsVisitedClick = () => {
    const formData = new FormData();
    formData.append('isVisited', JSON.stringify(!isVisited));
    changeIsVisited(formData);
    setAttractions(
      attractions.map((item) =>
        item.id === id ? { ...item, isVisited: !item.isVisited } : item
      )
    );
  };

  const onDeleteClick = () => {
    deleteItem();
    setAttractions(attractions.filter((item) => item.id !== id));
  };

  return (
    <div className="attraction-item">
      <Text variant="body-1" title={name} className={'attraction-item__name'}>
        {name}
      </Text>

      <Text
        variant="body-2"
        color="secondary"
        title={description}
        className={'attraction-item__description'}
      >
        {description}
      </Text>

      <img
        src={
          photoUrl.startsWith('http')
            ? photoUrl
            : `http://localhost:8081${photoUrl}`
        }
        alt={name}
        className="attraction-item__image"
        loading="lazy"
      />

      <div className={'attraction-item__rating'}>
        <Text variant="body-1">{rating}</Text>
        <div className="rating-buttons">
          {ratingValues.map((value) => (
            <Button
              key={value}
              onClick={() => onRatingButtonClick(value)}
              onMouseEnter={() => setFocusedRating(value)}
              onMouseLeave={() => {
                if (currentRating > 0) return;
                setFocusedRating(0);
              }}
              className={
                value <= focusedRating
                  ? 'rating-buttons__button--selected'
                  : 'rating-buttons__button--unselected'
              }
              disabled={isRatingButtonDisabled}
              view="flat"
            >
              <Star />
            </Button>
          ))}
        </div>
      </div>

      <div className={'attraction-item__location'}>
        <Text variant="body-1" className={'attraction-item__location'}>
          {location}
        </Text>
        <Link target="_blank" href={mapLink}>
          На карте
        </Link>
      </div>

      <Text
        variant="body-2"
        color="secondary"
        className={'attraction-item__addedAt'}
      >
        {formattedDate}
      </Text>

      <Button
        className={
          isVisited
            ? 'attraction-item__isVisited true'
            : 'attraction-item__isVisited false'
        }
        view={'flat'}
        size="m"
        onClick={onIsVisitedClick}
      >
        {isVisited ? 'Да' : 'Нет'}
      </Button>

      <div
        className={
          isAdminMode
            ? 'attraction-item__action-buttons'
            : 'attraction-item__action-buttons--hidden'
        }
      >
        <Button view="flat" size="s" onClick={() => setIsModalOpen(true)}>
          <Pen />
        </Button>
        <Button view="flat" size="s" onClick={onDeleteClick}>
          <Cross />
        </Button>
      </div>
      {isModalOpen && (
        <AttractionModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          attraction={attraction}
          attractions={attractions}
          setAttractions={setAttractions}
        />
      )}
    </div>
  );
};

export default AttractionItem;
