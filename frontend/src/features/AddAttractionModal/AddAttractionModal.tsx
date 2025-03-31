import {useState} from "react";
import {useRequest} from "../../shared/hooks/useRequest.ts";
import "./AddAttractionModal.scss"

interface Props {
    getAttractions: (attraction: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
}

const AddAttractionModal = ({setIsModalOpen, isModalOpen, getAttractions}: Props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
    const [preview, setPreview] = useState<string | null | any>("");
    const [image, setImage] = useState<File | null>(null);
    const [photoUrl, setPhotoURL] = useState("");
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");


    const {makeRequest} = useRequest({method: "POST", url: "attractions", onSuccess: getAttractions});

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
        makeRequest(formData);
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
                        src={preview}
                        alt="Предпросмотр"
                        style={{ maxWidth: "200px", marginTop: "10px" }}
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
                Добавить достопримечательность
            </button>
        </div>
    )
}

export default AddAttractionModal;