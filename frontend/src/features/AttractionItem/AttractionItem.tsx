import { IAttraction } from '../../shared/types/IAttraction.ts';
import {useRequest} from "../../shared/hooks/useRequest.ts";
import Star from "../../assets/Star.tsx"
import "./AttractionItem.scss";
import AttractionModal from "../AttractionModal/AttractionModal.tsx";
import {
    Card,
    Text,
    Button,
    Link,
} from '@gravity-ui/uikit';
import {useState} from "react";

interface Props {
    attraction: IAttraction;
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const AttractionItem = ({ attraction, setAttractions, attractions }: Props) => {
    const { id, name, description, rating: ratingArray, photoUrl, location, addedAt, mapLink, isVisited } = attraction;
    const {makeRequest: deleteItem} = useRequest({method:"DELETE", url:`attractions/${id}`});
    console.log(attractions)

    const [currentRating, setCurrentRating] = useState(0);
    const [focusedRating, setFocusedRating] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);

    const ratingValues = [1,2,3,4,5];
    let rating;
    if (!!ratingArray.length) {
        rating = ratingArray.reduce((a, c) => a + c, 0)/ratingArray.length;
        rating = rating.toFixed(2);
    }else{
        rating = 0;
    }

    const formattedDate = new Date(addedAt).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const {makeRequest: selectRating} = useRequest({method: "PUT", url: `attractions/${attraction.id}`});
    const onRatingButtonClick = (number: number) => {
        setCurrentRating(number);
        setFocusedRating(number)
        const formData = new FormData();
        ratingArray.push(number);
        formData.append('rating', JSON.stringify(ratingArray));
        selectRating(formData)
        setIsRatingButtonDisabled(true);
    }

    const {makeRequest: changeIsVisited} = useRequest({method: "PUT", url: `attractions/${attraction.id}`});

    const onIsVisitedClick = () => {
        const formData = new FormData();
        formData.append('isVisited', JSON.stringify(!isVisited));
        changeIsVisited(formData);
    }

    return (
        <Card className={"attraction-item"} type="container" view="outlined"
              style={{maxWidth: '400px', margin: '16px'}}>
            <AttractionModal
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                attraction={attraction}
                attractions={attractions}
                setAttractions={setAttractions}/>
            <img
                src={photoUrl.startsWith("http") ? photoUrl : `http://localhost:8081${photoUrl}`}
                alt={name}
                className="custom-image"
            />
            <Text variant="header-2">
                Название: {name}
            </Text>
            <Text variant="body-2" color="secondary" style={{marginTop: '8px'}}>
                Краткое описание: {description}
            </Text>
            <Text variant="body-1" style={{marginTop: '8px'}}>
                Рейтинг: {rating}
            </Text>
            <div className={"rating-button-wrapper"}>
                {ratingValues.map((value) => (
                    <Button
                        onClick={() => onRatingButtonClick(value)}
                        onMouseEnter={() => setFocusedRating(value)}
                        onMouseLeave={() => {
                            if (currentRating > 0) return
                            setFocusedRating(0)}}
                        className={value <= focusedRating
                            ? "rating-button-wrapper__button--selected"
                            : "rating-button-wrapper__button--unselected"}
                        disabled={isRatingButtonDisabled}
                    >
                        <Star/>
                    </Button>
                ))}
            </div>

            <Text variant="body-1" color="secondary" style={{marginTop: '8px'}}>
                Местонахождение: {location}
            </Text>
            <Text variant="body-2" color="secondary" style={{marginTop: '8px'}}>
                Добавлено: {formattedDate}
            </Text>
            {mapLink && (
                <Link href={mapLink} target="_blank" style={{marginTop: '8px'}}>
                    <Button view="outlined" size="m">
                        Посмотреть на карте
                    </Button>
                </Link>
            )}
            <Text variant="body-1" style={{marginTop: '8px'}}>
                Посещено: {isVisited ? "Да" : "Нет"}
            </Text>
            <Button view="outlined" size="m" onClick={onIsVisitedClick}>
                {isVisited ? "Я там ещё не был!" : "Я посетил!"}
            </Button>
            <Button view="outlined" size="m" onClick={deleteItem}>
                Удалить
            </Button>
            <Button view="outlined" size="m" onClick={()=> setIsModalOpen(true)}>
                Изменить информацию
            </Button>
        </Card>
    );
};

export default AttractionItem;