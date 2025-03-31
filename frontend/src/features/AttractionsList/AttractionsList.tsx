import { useRequest } from "../../shared/hooks/useRequest.ts";
import {IAttraction} from "../../shared/types/IAttraction.ts"
import AttractionItem from "../AttractionItem/AttractionItem.tsx";
import AddAttractionModal from "../AddAttractionModal/AddAttractionModal.tsx";
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
    return(
        <section>
            <h1>
                Достопримечательности
            </h1>
            <AddAttractionModal
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
                        <li>
                            <AttractionItem attraction={attraction}/>
                        </li>
                    ))}
                </ul>
            )
                :<p>Достопримечательностей не найдено</p>}
        </section>
    )
}

export default AttractionsList;