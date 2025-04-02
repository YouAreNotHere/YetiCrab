import {IAttraction} from "../../shared/types/IAttraction.ts"
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import "./AttractionsList.scss"
import {useState} from "react";
import {Button, Text} from '@gravity-ui/uikit';

interface Props{
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
    currentAttractions: IAttraction[];
    isAdminMode: boolean;
}

const AttractionsList = ({attractions, setAttractions, currentAttractions, isAdminMode}: Props) => {
    const [visibleAttractionsFilter, setVisibleAttractionsFilter] = useState("all");

    const visitedAttractions = currentAttractions.filter(attraction => attraction.isVisited);
    const unVisitedAttractions = currentAttractions.filter(attraction => !attraction.isVisited);
    let visibleAttractions: IAttraction[];
    switch (visibleAttractionsFilter) {
        case "all":
            visibleAttractions = currentAttractions;
            break;
        case "visited":
            visibleAttractions = visitedAttractions;
            break;
        case "unvisited":
            visibleAttractions = unVisitedAttractions;
            break;
        default:
            visibleAttractions = currentAttractions;
    }

    return (
        <section className={"attractions-form"}>
            <h1>Достопримечательности</h1>
            <p>Всего достопримечательностей: {currentAttractions.length}</p>
            <p>Из них посетили: {visitedAttractions.length}</p>
            <div className="filter-buttons">
                <Button
                    view="outlined-info"
                    onClick = {()=>setVisibleAttractionsFilter("all")}
                >
                    Показать все
                </Button>
                <Button
                    view="outlined-info"
                    onClick = {()=>setVisibleAttractionsFilter("visited")}
                >
                    Показать только посещенные
                </Button>
                <Button
                    view="outlined-info"
                    onClick = {()=>setVisibleAttractionsFilter("unvisited")}
                >
                    Показать только непосещенные
                </Button>
            </div>


            <div className="attractions-table">
                <div className="table-headers">
                    <Text variant="body-1"  className={"table-headers__title"}>Название</Text>
                    <Text variant="body-1"  className={"table-headers__description"}>Описание</Text>
                    <Text variant="body-1"  className={"table-headers__image"}>Изображение</Text>
                    <Text variant="body-1"  className={"table-headers__rating"}>Рейтинг</Text>
                    <Text variant="body-1"  className={"table-headers__location"}>Местонахождение</Text>
                    <Text variant="body-1"  className={"table-headers__AddedAt"}>Добавлено</Text>
                    <Text variant="body-1"  className={"table-headers__isVisited"}>Посещено</Text>
                    {isAdminMode ? <Text variant="body-1"  className={"table-headers__action"}>Действия</Text> : null}
                </div>

                {!!visibleAttractions.length ? (
                    visibleAttractions.map((attraction) => (
                        <AttractionItem
                            key={attraction.id}
                            attraction={attraction}
                            attractions={attractions}
                            setAttractions={setAttractions}
                            isAdminMode={isAdminMode}
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