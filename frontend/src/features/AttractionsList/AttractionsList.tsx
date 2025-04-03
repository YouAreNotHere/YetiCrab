import { IAttraction } from "../../shared/types/IAttraction.ts";
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import "./AttractionsList.scss";
import { useState, useMemo } from "react";
import { Button, Text, Select } from "@gravity-ui/uikit";

interface Props {
    attractions: IAttraction[];
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
    currentAttractions: IAttraction[];
    isAdminMode: boolean;
}

const AttractionsList = ({
                             attractions,
                             setAttractions,
                             currentAttractions,
                             isAdminMode,
                         }: Props) => {
    const [visibleAttractionsFilter, setVisibleAttractionsFilter] =
        useState<"all" | "visited" | "unvisited">("all");
    const [sortedBy, setSortedBy] = useState<
        "name-asc" | "name-desc" | "rating-asc" | "rating-desc" | "addedAt-asc" | "addedAt-desc"
    >("name-asc");
    const [showOnlyRated, setShowOnlyRated] = useState(false);
    const filterOptions = [
            {value: "all", content: "Показать все"},
            {value: "visited", content: "Посещенные"},
            {value: 'unvisited', content: 'Непосещенные'},
        ];
    const sortOptions = [
        {value: "name-asc", content: "Имя (возрастание)"},
        {value: "name-desc", content: "Имя (убывание)"},
        {value: "rating-asc", content: "Рейтинг (возрастание)"},
        {value: "rating-desc", content: "Рейтинг (убывание)"},
        {value: "addedAt-asc", content: "Дата (возрастание)"},
        {value: "addedAt-desc", content: "Дата (убывание)"},
    ]
    type TSort = "name-asc" | "name-desc" | "rating-asc" | "rating-desc" | "addedAt-asc" | "addedAt-desc";
    type TFilter = "all" | "visited" | "unvisited";
    const calculateAverageRating = (rating: number[]): number => {
        if (!rating || rating.length === 0) return 0;
        const sum = rating.reduce((acc, value) => acc + value, 0);
        return sum / rating.length;
    };

    const visibleAttractions = useMemo(() => {

        let filtered: IAttraction[] = [];
        switch (visibleAttractionsFilter) {
            case "visited":
                filtered = currentAttractions.filter((attraction) => attraction.isVisited);
                break;
            case "unvisited":
                filtered = currentAttractions.filter((attraction) => !attraction.isVisited);
                break;
            default:
                filtered = currentAttractions;
        }

        if (showOnlyRated) filtered = filtered.filter((item) => item.rating.length > 0);

        const sorted = [...filtered].sort((a, b) => {
            let result = 0;

            switch (sortedBy) {
                case "name-asc":
                    result = a.name.localeCompare(b.name);
                    break;
                case "name-desc":
                    result = b.name.localeCompare(a.name);
                    break;
                case "rating-asc": {
                    const avgRatingA = calculateAverageRating(a.rating);
                    const avgRatingB = calculateAverageRating(b.rating);
                    result = avgRatingA - avgRatingB;
                    break;
                }
                case "rating-desc": {
                    const avgRatingA = calculateAverageRating(a.rating);
                    const avgRatingB = calculateAverageRating(b.rating);
                    result = avgRatingB - avgRatingA;
                    break;
                }
                case "addedAt-asc":
                    result =
                        new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
                    break;
                case "addedAt-desc":
                    result =
                        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
                    break;
                default:
                    break;
            }

            return result;
        });

        return sorted;
    }, [currentAttractions, visibleAttractionsFilter, sortedBy, showOnlyRated]);

    return (
        <section className="attractions-form">
            <div className="attractions-form--inner-wrapper">
                <h1>Достопримечательности</h1>

                <Button
                    view={showOnlyRated ? "action" : "outlined"}
                    onClick = {()=> setShowOnlyRated(!showOnlyRated)}>
                    {!showOnlyRated ? "Только с оценками" : "Показать все"}
                </Button>

                <div className="filter-and-sort">
                    <Select
                            placeholder='Фильтровать по'
                            options={filterOptions}
                            onUpdate={(value) => setVisibleAttractionsFilter(value[0] as TFilter)}
                        />
                    <Select
                            placeholder='Сортировать по'
                            options={sortOptions}
                            onUpdate={(value) => setSortedBy(value[0] as TSort)}
                    />
                </div>
            </div>

            <p>Всего достопримечательностей: {currentAttractions.length}</p>
            <p>
                Из них посетили:{" "}
                {currentAttractions.filter((attraction) => attraction.isVisited).length}
            </p>

            <div className="attractions-table">
                <div className="table-headers">
                    <Text variant="body-1" className="table-headers__title">
                        Название
                    </Text>
                    <Text variant="body-1" className="table-headers__description">
                        Описание
                    </Text>
                    <Text variant="body-1" className="table-headers__image">
                        Изображение
                    </Text>
                    <Text variant="body-1" className="table-headers__rating">
                        Рейтинг
                    </Text>
                    <Text variant="body-1" className="table-headers__location">
                        Местонахождение
                    </Text>
                    <Text variant="body-1" className="table-headers__AddedAt">
                        Добавлено
                    </Text>
                    <Text variant="body-1" className="table-headers__isVisited">
                        Посещено
                    </Text>
                    {isAdminMode ? (
                        <Text variant="body-1" className="table-headers__action">
                            Действия
                        </Text>
                    ) : null}
                </div>

                {visibleAttractions.length > 0 ? (
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