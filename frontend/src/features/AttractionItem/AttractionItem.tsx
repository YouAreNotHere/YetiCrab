import {IAttraction} from "../../shared/types/IAttraction.ts"

interface Props {
    attraction: IAttraction
}

const AttractionItem= ({attraction}: Props) => {
    const { name, description, addedAt, rating, photoUrl, location, coordinates, mapLink, isVisites,} = attraction;
    return (
        <div>
            <p>Attraction</p>
            <h1>{name}</h1>
            <p>{description}</p>
            {/*<p>{addedAt}</p>*/}
            <p>{rating}</p>
            <img src={photoUrl}/>
            <p>{location}</p>
            {/* //coordinates */}
            {/* mapLink */}
            <p>{isVisites}</p>
        </div>
    )
}

export default AttractionItem;