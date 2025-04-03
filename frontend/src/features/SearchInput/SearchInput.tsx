import React, { useState, useEffect, useCallback } from 'react';
import { TextInput } from '@gravity-ui/uikit';
import { IAttraction } from '../../shared/types/IAttraction.ts';
import './SearchInput.scss';

interface Props {
  attractions: IAttraction[];
  setCurrentAttraction: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const SearchInput = ({ attractions, setCurrentAttraction }: Props) => {
  const [text, setText] = useState('');

  const filterAttractions = useCallback(
    (searchText: string) => {
      if (!attractions) return;

      if (searchText === '') {
        setCurrentAttraction(attractions);
        return;
      }

      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regExp = new RegExp(`${escapedText}`, 'i');
      const filtered = attractions.filter((item) => regExp.test(item.name));
      setCurrentAttraction(filtered);
    },
    [attractions, setCurrentAttraction]
  );

  useEffect(() => {
    if (text === '') {
      filterAttractions('');
      return;
    }

    const debounceTimer = setTimeout(() => {
      filterAttractions(text);
    }, 500);

    return () => clearTimeout(debounceTimer); // Очистка таймера при каждом изменении text
  }, [text, filterAttractions]);

  return (
    <div className="search-input">
      <TextInput
        placeholder="Поиск"
        value={text}
        onUpdate={(value) => setText(value)}
        size="m"
      />
    </div>
  );
};

export default SearchInput;
