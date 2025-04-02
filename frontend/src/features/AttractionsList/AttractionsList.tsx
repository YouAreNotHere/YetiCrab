import {IAttraction} from "../../shared/types/IAttraction.ts"
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import "./AttractionsList.scss"
import {  Text } from '@gravity-ui/uikit';

interface Props{
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
    currentAttractions: IAttraction[];
}

const AttractionsList = ({attractions, setAttractions, currentAttractions}: Props) => {

    const visitedAttractions = currentAttractions.filter(attraction => attraction.isVisited);

    return (
        <section>
            <h1>Достопримечательности</h1>
            <p>Всего достопримечательностей: {currentAttractions.length}</p>
            <p>Из них посетили: {visitedAttractions.length}</p>

            <div className="attractions-table">
                <div className="table-headers">
                    <Text variant="body-1"  className={"table-headers__title"}>Название</Text>
                    <Text variant="body-1"  className={"table-headers__description"}>Описание</Text>
                    <Text variant="body-1"  className={"table-headers__image"}>Изображение</Text>
                    <Text variant="body-1"  className={"table-headers__rating"}>Рейтинг</Text>
                    <Text variant="body-1"  className={"table-headers__location"}>Местонахождение</Text>
                    <Text variant="body-1"  className={"table-headers__AddedAt"}>Добавлено</Text>
                    <Text variant="body-1"  className={"table-headers__isVisited"}>Посещено</Text>
                    <Text variant="body-1"  className={"table-headers__action"}>Действия</Text>
                </div>

                {/* Список достопримечательностей */}
                {!!currentAttractions.length ? (
                    currentAttractions.map((attraction) => (
                        <AttractionItem
                            key={attraction.id}
                            attraction={attraction}
                            attractions={attractions}
                            setAttractions={setAttractions}
                        />
                    ))
                ) : (
                    <p>Достопримечательностей не найдено</p>
                )}
            </div>
        </section>
    );
};

export default AttractionsList;