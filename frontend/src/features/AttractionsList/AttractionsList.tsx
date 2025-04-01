import { useRequest } from "../../shared/hooks/useRequest.ts";
import {IAttraction} from "../../shared/types/IAttraction.ts"
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import AttractionModal from "../AttractionModal/AttractionModal.tsx";
import { useState, useEffect } from 'react'

const AttractionsList = () => {
    const [attractions, setAttractions] = useState<IAttraction[]>([]);
    const [isAddAttractionModalOpen, setIsAddAttractionModalOpen] = useState(false);
    const {data, makeRequest, isLoading } = useRequest({method: "GET", url: "attractions" });
    
    useEffect(()=>{
        makeRequest();
    },[])

    useEffect(()=>{
        if (!data) return
        setAttractions(data)
    },[data])

    if (isLoading || !data) return <p>Loading...</p>;
    console.log(data)
    const visitedAttractions = attractions.filter(attraction => attraction.isVisited);
    console.log(attractions)
    return(
        <section>
            <h1>
                Достопримечательности
            </h1>
            <p>Всего достопримечательностей: {attractions.length}</p>
            <p>Из них посетили: {visitedAttractions.length}</p>
            <AttractionModal
                setAttractions={setAttractions}
                attractions={attractions}
                getAttractions={makeRequest}
                setIsModalOpen={setIsAddAttractionModalOpen}
                isModalOpen={isAddAttractionModalOpen}/>
            <button
                onClick={()=>setIsAddAttractionModalOpen(!isAddAttractionModalOpen)}
                className={"add-attraction__button"}>
                Добавить достопримечательность
            </button>
            {!!data.length ? (
                <ul>
                    {attractions.map((attraction) => (
                        <li key={attraction.id}>
                            <AttractionItem attraction={attraction} setAttractions={setAttractions}/>
                        </li>
                    ))}
                </ul>
            )
                :<p>Достопримечательностей не найдено</p>}
        </section>
    )
}

export default AttractionsList;