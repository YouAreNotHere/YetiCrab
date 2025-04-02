import {useState} from "react";
import {useRequest} from "../../shared/hooks/useRequest.ts";
import {IAttraction, IUpdatedAttraction} from "../../shared/types/IAttraction.ts";
import "./AttractionModal.scss"

interface Props {
    getAttractions?: (attraction: string) => void;
    attraction?: IUpdatedAttraction;
    attractions?: IAttraction[];
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
    setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const emptyAttraction = {
    id: "",
    name: "",
    description: "",
    photoUrl: "",
    location: "",
    mapLink: "",
    isVisited: false,
}

const AttractionModal = ({setIsModalOpen, isModalOpen, getAttractions, attraction = emptyAttraction, setAttractions, attractions}: Props) => {
    const [name, setName] = useState(attraction.name);
    const [description, setDescription] = useState(attraction.description);
    const [preview, setPreview] = useState<string | null | any>(attraction?.photoUrl);
    const [image, setImage] = useState<File | null>(null);
    const [photoUrl, setPhotoURL] = useState(attraction?.photoUrl);
    const [location, setLocation] = useState(attraction?.location);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    // console.log(attractions);

    const {makeRequest: createAttraction} = useRequest({method: "POST", url: "attractions", onSuccess: getAttractions});
    const {makeRequest: updateAttraction} = useRequest({method: "PUT", url: `attractions/${attraction.id}`});

    const onSubmitHandler = () => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        if (image) formData.append('image', image);
        if (photoUrl) formData.append('photoUrl', photoUrl);
        formData.append("location", location);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        if (attraction.id && attractions){
            updateAttraction(formData);
            setAttractions(attractions.map(item =>(
                attraction.id === item.id ? item : {
                    ...item, name, description, photoUrl, location, latitude: Number(latitude), longitude: Number(longitude)}
            )));
        }else{
            createAttraction(formData);
        }

        setIsModalOpen(false);

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={isModalOpen ? "add-attraction-modal" : "add-attraction-modal--hidden"}>
            <button onClick={(() => setIsModalOpen(false))}>
                X
            </button>
            <input
                placeholder={"Название"}
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            <input
                placeholder={"Описание"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>
            <div>
                <p>Укажите ссылку на фото или прикрепите само фото</p>
                <input
                    placeholder={"Ссылка на фото"}
                    value={photoUrl}
                    onChange={(e) => {
                        setPreview(e.target.value);
                        setPhotoURL(e.target.value);
                    }
                }
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {preview && (
                    <img
                        src={preview.startsWith("http") ? preview : `http://localhost:8081${preview}`}
                        alt={name}
                        className="custom-image"
                    />
                )}
            </div>
            <input
                placeholder={"Местонахождение"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <input
                placeholder={"Широта"}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                placeholder={"Долгота"}
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            <button onClick={onSubmitHandler}>
                Подтвердить
            </button>
        </div>
    )
}

export default AttractionModal;