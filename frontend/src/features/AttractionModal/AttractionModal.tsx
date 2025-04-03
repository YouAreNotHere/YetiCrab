import { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Button, TextInput, TextArea } from '@gravity-ui/uikit';
import { useRequest } from '../../shared/hooks/useRequest.ts';
import {
  IAttraction,
  IUpdatedAttraction,
} from '../../shared/types/IAttraction.ts';
import Cross from '../../assets/Cross.tsx';
import './AttractionModal.scss';

interface Props {
  getAttractions?: (attraction: string) => void;
  attraction?: IUpdatedAttraction;
  attractions?: IAttraction[];
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  setAttractions: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const emptyAttraction = {
  id: '',
  name: '',
  description: '',
  photoUrl: '',
  location: '',
  mapLink: '',
  isVisited: false,
};

const AttractionModal = ({
  setIsModalOpen,
  isModalOpen,
  getAttractions,
  attraction = emptyAttraction,
  setAttractions,
  attractions,
}: Props) => {
  const [name, setName] = useState(attraction.name);
  const [description, setDescription] = useState(attraction.description);
  const [preview, setPreview] = useState<string | null>(attraction?.photoUrl);
  const [image, setImage] = useState<File | null>(null);
  const [photoUrl, setPhotoURL] = useState(attraction?.photoUrl);
  const [location, setLocation] = useState(attraction?.location);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const isButtonDisabled = useMemo(() => {
    return (
      !name ||
      !description ||
      !location ||
      !latitude ||
      !longitude ||
      (!photoUrl && !image)
    );
  }, [name, description, location, latitude, longitude, photoUrl, image]);

  const isBothOfLinkAndImage = useMemo(() => {
    return !!photoUrl && !!image;
  }, [photoUrl, image]);

  useEffect(() => {
    setName(attraction.name);
    setDescription(attraction.description);
    setPreview(attraction.photoUrl || null);
    setPhotoURL(attraction.photoUrl || '');
    setLocation(attraction.location || '');
    setLatitude(attraction.latitude?.toString() || '');
    setLongitude(attraction.longitude?.toString() || '');
    setImage(null);
  }, [isModalOpen, attraction]);

  const { makeRequest: createAttraction } = useRequest({
    method: 'POST',
    url: 'attractions',
    onSuccess: getAttractions,
  });
  const { makeRequest: updateAttraction } = useRequest({
    method: 'PUT',
    url: `attractions/${attraction.id}`,
  });

  const onSubmitHandler = () => {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);
    if (photoUrl) formData.append('photoUrl', photoUrl);
    formData.append('location', location);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    if (attraction.id && attractions) {
      updateAttraction(formData);
      setAttractions(
        attractions.map((item) =>
          attraction.id !== item.id
            ? item
            : {
                ...item,
                name,
                description,
                photoUrl,
                location,
                latitude: Number(latitude),
                longitude: Number(longitude),
              }
        )
      );
    } else {
      createAttraction(formData);
    }

    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onCancelSubmit = () => {
    setImage(null);
    setName('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setPhotoURL('');
    setPreview('');
    setLocation('');
    setIsModalOpen(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsModalOpen]);

  return (
    <Modal open={isModalOpen}>
      <div className="attraction-modal__content" ref={modalRef}>
        <div className="attraction-modal__button-wrapper">
          <Button view="flat" onClick={onCancelSubmit}>
            <Cross />
          </Button>
        </div>
        <TextInput
          placeholder="Название"
          value={name}
          onUpdate={(value) => setName(value)}
        />
        <TextArea
          placeholder="Описание"
          value={description}
          onUpdate={(value) => setDescription(value)}
        />
        <div className={'attraction-modal__pictures'}>
          <p>Укажите ссылку на фото или прикрепите само фото</p>
          <TextInput
            placeholder="Ссылка на фото"
            value={photoUrl}
            onUpdate={(value) => {
              setPreview(value);
              setPhotoURL(value);
            }}
          />
          <div className={'attraction-modal__buttons-wrapper'}>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
              <Button
                view="flat"
                onClick={() => {
                  setImage(null);
                  setPreview('');
                }}
              >
                Удалить изображение
              </Button>
            )}
          </div>
          {isBothOfLinkAndImage && <p>Удалите изображение или ссылку</p>}
          {preview && (
            <img
              src={
                preview.startsWith('http') || preview.startsWith('data:image')
                  ? preview
                  : `http://localhost:8081${preview}`
              }
              alt={name}
              width={200}
              height={200}
            />
          )}
        </div>
        <TextInput
          placeholder="Местонахождение"
          value={location}
          onUpdate={(value) => setLocation(value)}
        />
        <TextInput
          placeholder="Широта"
          value={latitude}
          onUpdate={(value) => setLatitude(value)}
        />
        <TextInput
          placeholder="Долгота"
          value={longitude}
          onUpdate={(value) => setLongitude(value)}
        />
        <div className="attraction-modal__buttons">
          <Button
            disabled={isButtonDisabled || isBothOfLinkAndImage}
            view="action"
            onClick={onSubmitHandler}
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttractionModal;
