import { IAttraction } from "../../shared/types/IAttraction.ts";
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import "./AttractionsList.scss";
import { useState, useMemo } from "react";
import { Button, Text } from "@gravity-ui/uikit";

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
    const [whichModalOpen, setWhichModalOpen] = useState<null | string>(null);

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

        const sorted = [...filtered].sort((a, b) => {
            let result = 0;

            switch (sortedBy) {
                case "name-asc":
                    result = a.name.localeCompare(b.name); // По имени (возрастание)
                    break;
                case "name-desc":
                    result = b.name.localeCompare(a.name); // По имени (убывание)
                    break;
                case "rating-asc": {
                    const avgRatingA = calculateAverageRating(a.rating);
                    const avgRatingB = calculateAverageRating(b.rating);
                    result = avgRatingA - avgRatingB; // По рейтингу (возрастание)
                    break;
                }
                case "rating-desc": {
                    const avgRatingA = calculateAverageRating(a.rating);
                    const avgRatingB = calculateAverageRating(b.rating);
                    result = avgRatingB - avgRatingA; // По рейтингу (убывание)
                    break;
                }
                case "addedAt-asc":
                    result =
                        new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(); // По дате добавления (возрастание)
                    break;
                case "addedAt-desc":
                    result =
                        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(); // По дате добавления (убывание)
                    break;
                default:
                    break;
            }

            return result;
        });

        return sorted;
    }, [currentAttractions, visibleAttractionsFilter, sortedBy]);

    return (
        <section className="attractions-form">
            <div className="attractions-form--inner-wrapper">
                <h1>Достопримечательности</h1>

                <div className="filter-and-sort">
                    {whichModalOpen === "filter" ?
                        <div className="filter-buttons">
                        <Button
                            view={visibleAttractionsFilter === "all" ? "action" : "outlined"}
                            onClick={() => {
                                setWhichModalOpen(null)
                                setVisibleAttractionsFilter("all")}
                            }
                        >
                            Показать все
                        </Button>
                        <Button
                            view={visibleAttractionsFilter === "visited" ? "action" : "outlined"}
                            onClick={() => {
                                setWhichModalOpen(null)
                                setVisibleAttractionsFilter("visited")}
                            }
                        >
                            Показать только посещенные
                        </Button>
                        <Button
                            view={visibleAttractionsFilter === "unvisited" ? "action" : "outlined"}
                            onClick={() => {
                                setWhichModalOpen(null)
                                setVisibleAttractionsFilter("unvisited")}
                            }
                        >
                            Показать только непосещенные
                        </Button>
                    </div>
                        : <Button view = "outlined" onClick={()=>setWhichModalOpen("filter")}>
                            Фильтровать по
                         </Button>}

                    {whichModalOpen === "sort" ?
                        <div className="sort-buttons">
                            <Button
                                view={sortedBy === "name-asc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("name-asc")}
                                }
                            >
                                По имени (возрастание)
                            </Button>
                            <Button
                                view={sortedBy === "name-desc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("name-desc")}
                                }
                            >
                                По имени (убывание)
                            </Button>
                            <Button
                                view={sortedBy === "rating-asc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("rating-asc")}
                                }
                            >
                                По рейтингу (возрастание)
                            </Button>
                            <Button
                                view={sortedBy === "rating-desc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("rating-desc")}
                                }
                            >
                                По рейтингу (убывание)
                            </Button>
                            <Button
                                view={sortedBy === "addedAt-asc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("addedAt-asc")}
                                }
                            >
                                По дате добавления (возрастание)
                            </Button>
                            <Button
                                view={sortedBy === "addedAt-desc" ? "action" : "outlined"}
                                onClick={() => {
                                    setWhichModalOpen(null)
                                    setSortedBy("addedAt-desc")}
                                }
                            >
                                По дате добавления (убывание)
                            </Button>
                        </div>
                        : <Button view = "outlined" onClick={()=>setWhichModalOpen("sort")}>
                            Сортировать по
                          </Button>
                    }

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