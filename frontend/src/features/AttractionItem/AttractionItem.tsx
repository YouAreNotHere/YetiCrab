import { IAttraction } from '../../shared/types/IAttraction.ts';
import {useRequest} from "../../shared/hooks/useRequest.ts";
import "./AttractionItem.scss";
import {
    Card,
    Text,
    Button,
    Link,
} from '@gravity-ui/uikit';

interface Props {
    attraction: IAttraction;
}

const AttractionItem = ({ attraction }: Props) => {
    const { id, name, description, rating, photoUrl, location, addedAt, mapLink, isVisites } = attraction;
    const {makeRequest: deleteItem} = useRequest({method:"DELETE", url:`attractions/${id}`});

    const formattedDate = new Date(addedAt).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card className={"attraction-item"} type="container" view="outlined"
              style={{maxWidth: '400px', margin: '16px'}}>
            <img
                src={photoUrl.startsWith("http") ? photoUrl : `http://localhost:8081${photoUrl}`}
                alt={name}
                className="custom-image"
            />
            <Text variant="header-2">
                {name}
            </Text>
            <Text variant="body-2" color="secondary" style={{marginTop: '8px'}}>
                {description}
            </Text>
            <Text variant="body-1" style={{marginTop: '8px'}}>
                Рейтинг: {rating}
            </Text>
            <Text variant="body-1" color="secondary" style={{marginTop: '8px'}}>
                Место: {location}
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
                Посещено: {isVisites ? "Да" : "Нет"}
            </Text>
            <Button view="outlined" size="m" onClick={deleteItem}>
                Удалить
            </Button>
        </Card>
    );
};

export default AttractionItem;