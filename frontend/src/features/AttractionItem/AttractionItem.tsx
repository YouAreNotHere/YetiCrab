import { IAttraction } from '../../shared/types/IAttraction.ts';
import {useRequest} from "../../shared/hooks/useRequest.ts";
import Star from "../../assets/Star.tsx"
import "./AttractionItem.scss";
import AttractionModal from "../AttractionModal/AttractionModal.tsx";
import {
    Text,
    Button,
} from '@gravity-ui/uikit';
import {useState} from "react";

interface Props {
    attraction: IAttraction;
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

interface Props {
    attraction: IAttraction;
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const AttractionItem = ({ attraction, setAttractions, attractions }: Props) => {
    const { id, name, description, rating: ratingArray, photoUrl, location, addedAt, mapLink, isVisited } = attraction;

    const [currentRating, setCurrentRating] = useState(0);
    const [focusedRating, setFocusedRating] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);

    const ratingValues = [1, 2, 3, 4, 5];

    // Вычисляем средний рейтинг
    const rating = ratingArray.length > 0
        ? (ratingArray.reduce((a, c) => a + c, 0) / ratingArray.length).toFixed(2)
        : 'нет оценок';

    // Форматируем дату добавления
    const formattedDate = new Date(addedAt).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Запросы
    const { makeRequest: deleteItem } = useRequest({ method: "DELETE", url: `attractions/${id}` });
    const { makeRequest: selectRating } = useRequest({ method: "PUT", url: `attractions/${attraction.id}` });
    const { makeRequest: changeIsVisited } = useRequest({ method: "PUT", url: `attractions/${attraction.id}` });

    // Обработчик нажатия на кнопку оценки
    const onRatingButtonClick = (number: number) => {
        setCurrentRating(number);
        setFocusedRating(number);
        const formData = new FormData();
        ratingArray.push(number);
        formData.append('rating', JSON.stringify(ratingArray));
        selectRating(formData);
        setIsRatingButtonDisabled(true);
    };

    // Обработчик изменения статуса "посещено"
    const onIsVisitedClick = () => {
        const formData = new FormData();
        formData.append('isVisited', JSON.stringify(!isVisited));
        changeIsVisited(formData);
        setAttractions(attractions.map(item=> item.id === id ? {...item, isVisited: !item.isVisited} : item));
    };

    return (
        <div className="attraction-item">
            {/* Название */}
            <Text variant="body-1" title={name} className={"attraction-item__name"}>
                {name}
            </Text>

            {/* Описание */}
            <Text variant="body-2" color="secondary" title={description} className={"attraction-item__description"}>
                {description}
            </Text>

            <img
                src={photoUrl.startsWith("http") ? photoUrl : `http://localhost:8081${photoUrl}`}
                alt={name}
                className="attraction-item__image"
            />

            {/* Рейтинг */}
            <div className={"attraction-item__rating"}>
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
                            className={value <= focusedRating ? 'rating-buttons__button--selected' : 'rating-buttons__button--unselected'}
                            disabled={isRatingButtonDisabled}
                            view="flat"
                        >
                            <Star/>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Местонахождение */}
            <Text variant="body-1" className={"attraction-item__location"}>
                {location}
            </Text>

            {/* Добавлено */}
            <Text variant="body-2" color="secondary" className={"attraction-item__addedAt"}>
                {formattedDate}
            </Text>

            <Button
                className={isVisited ? "attraction-item__isVisited true" : "attraction-item__isVisited false"}
                view= {"flat"}
                size="m"
                onClick={onIsVisitedClick}
            >
                {isVisited ? "Да" : "Нет"}
            </Button>

            {/* Действия */}
            <div className={"attraction-item__action-buttons"}>
                <Button view="outlined" size="s" onClick={deleteItem}>
                    Удалить
                </Button>
                <Button view="outlined" size="s" onClick={() => setIsModalOpen(true)}>
                    Изменить
                </Button>
            </div>

            {/* Модальное окно */}
            <AttractionModal
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                attraction={attraction}
                attractions={attractions}
                setAttractions={setAttractions}
            />
        </div>
    );
};

export default AttractionItem;