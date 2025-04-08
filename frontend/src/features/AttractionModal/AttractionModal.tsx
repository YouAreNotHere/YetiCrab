import { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Button, TextInput, TextArea, Text } from '@gravity-ui/uikit';
import {useForm, Controller} from "react-hook-form";

import { useRequest } from '../../shared/hooks/useRequest.ts';
import {
  IAttraction,
  IUpdatedAttraction,
    IFetchAttraction,
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

const emptyAttraction: IFetchAttraction = {
  id: '',
  name: '',
  description: '',
  photoUrl: '',
  location: '',
    latitude: '',
    longitude: '',
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

  const [preview, setPreview] = useState<string | null>(attraction?.photoUrl);

  const {
    handleSubmit,
      watch,
      setValue,
    control,
    reset,
    formState: {errors},} = useForm< IFetchAttraction>({mode: "onBlur",});

  const name = watch("name");
  const description = watch("description");
  const image = watch("image");
  const photoUrl = watch("photoUrl");
  const location = watch("location");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const isBothOfLinkAndImage = useMemo(() => {
    return !!photoUrl && !!image;
  }, [photoUrl, image]);

  useEffect(() => {
      if (!attraction) return
    reset(attraction);
  }, [isModalOpen, attraction, reset]);

  const { makeRequest: createAttraction } = useRequest({
    method: 'POST',
    url: 'attractions',
    onSuccess: getAttractions,
  });
  const { makeRequest: updateAttraction } = useRequest({
    method: 'PUT',
    url: `attractions/${attraction.id}`,
  });

  const onSubmitHandler = (data: IFetchAttraction) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    if (data.photoUrl) formData.append('photoUrl', data.photoUrl);
    formData.append('location', data.location);
    formData.append('latitude', String(data.latitude));
    formData.append('longitude', String(data.longitude));

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImg: (file: File) => void) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    setImg(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
          <Button
              view="flat"
              onClick={() => setIsModalOpen(false)}
          >
            <Cross/>
          </Button>
        </div>

          <Controller
              name="name"
              control={control}
              rules={{
                required: "Название не заполнено",
                maxLength: {message: "Название слишком длинное", value: 25}
              }}
              render={({field}) => (
                  <TextInput
                      placeholder="Название"
                      controlRef={field.ref}
                      value={field.value}
                      onUpdate={(value) => field.onChange(value)}
                  />
              )}
          />
          {errors.name && (
              <Text color="danger">{(errors.name as { message: string }).message}</Text>
          )}

        <Controller
          name="description"
          control={control}
          rules = {{required: "Описание не заполнено"}}
          render={({field}) => (
              <TextArea
                  placeholder="Описание"
                  value={field.value}
                  onUpdate={(value) => field.onChange(value)}
                  controlRef={field.ref}
              />
          )}
          />
          {errors.description && (
              <Text color="danger">{(errors.description as { message: string }).message}</Text>
          )}

        <div className={'attraction-modal__pictures'}>

          <Text variant="body-1" >Укажите ссылку на фото или прикрепите само фото</Text>

          <Controller
              name="photoUrl"
              control={control}
              rules={{
                  maxLength: {message: "Ссылка слишком длинная", value: 50},
                  validate: (value, formValues) =>
                      !value && !formValues.image ? "Необходимо указать ссылку или загрузить файл" : true
              }}
              render={({field}) => (
                  <TextInput
                      placeholder="Ссылка на фото"
                      value={field.value}
                      controlRef={field.ref}
                      onUpdate={(value) => {
                        setPreview(value);
                        field.onChange(value)
                      }}
                  />
              )} />

          <div className={'attraction-modal__buttons-wrapper'}>
            <Controller
                name={"image"}
                control={control}
                rules={{
                    validate: (value, formValues) =>
                        !value && !formValues.photoUrl ? "Необходимо указать ссылку или загрузить файл" : true
                }}
                render={({field}) => (
                    <input
                        id="file-upload"
                        type="file"
                        ref={field.ref}
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                    />
                )}
                />
                {image && (
                    <Button
                        view="flat"
                        onClick={() => {
                          setValue("image",undefined);
                          setPreview('');
                    }}
                >
                  Удалить изображение
                </Button>
            )}
          </div>

            {(errors.photoUrl || errors.image) && (
                <Text color="danger">
                    {errors.photoUrl?.message || errors.image?.message}
                </Text>
            )}

          {isBothOfLinkAndImage && <Text color = "danger">Допустимо оставить либо ссылку на картинку, либо файл с картинкой</Text>}

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

        <Controller
            name={"location"}
            control={control}
            rules = {{required: "Местоположение не заполнено"}}
            render={({field}) => (
                <TextInput
                    placeholder="Местонахождение"
                    controlRef={field.ref}
                    value={field.value}
                    onUpdate={(value) => field.onChange(value)}
                />
            )}
        />
          {errors.location && (
              <Text color="danger">{(errors.location as { message: string }).message}</Text>
          )}

        <Controller
            name={"latitude"}
            control = {control}
            rules = {{
                required: "Широта не заполнена",
                pattern: {
                    value: /^-?\d*\.?\d+$/,
                    message: "Широта должна быть числом"
                }
            }}
            render={({field})=> (
                <TextInput
                    placeholder="Широта"
                    value={String(field.value)}
                    controlRef={field.ref}
                    onUpdate={(value) => field.onChange(value)}
                />
            )}
            />
          {errors.latitude && (
              <Text color="danger">{(errors.latitude as { message: string }).message}</Text>
          )}

        <Controller
            name={"longitude"}
            control={control}
            rules = {{
                required: "Долгота  не заполнена",
                pattern: {
                    value: /^-?\d*\.?\d+$/,
                    message: "Долгота должна быть числом"
                }
        }}
            render={({field})=> (
                <TextInput
                    placeholder="Долгота"
                    value={String(field.value)}
                    controlRef={field.ref}
                    onUpdate={(value) => field.onChange(value)}
                />
            )}
            />
          {errors.longitude && (
              <Text color="danger">{(errors.longitude as { message: string }).message}</Text>
          )}

        <div className="attraction-modal__buttons">
          <Button
              view="action"
              onClick={handleSubmit(onSubmitHandler)}
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttractionModal;
