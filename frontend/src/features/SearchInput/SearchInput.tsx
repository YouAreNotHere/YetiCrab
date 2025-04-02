import {useState, useEffect} from "react";
import {IAttraction} from "../../shared/types/IAttraction.ts";

interface Props{
    attractions: IAttraction[];
    setCurrentAttraction: React.Dispatch<React.SetStateAction<IAttraction[]>>;
}

const SearchInput = ({attractions, setCurrentAttraction}: Props) => {
    const [text, setText] = useState('');
    if (text === "") setCurrentAttraction(attractions);
    let regText : RegExp;
    if (!!text) regText = new RegExp(`^${text}+`,"i");
    let likelyTodos: IAttraction[] = attractions?.filter((item: IAttraction) => regText?.test(item.name));

    useEffect(() => {
        likelyTodos = attractions?.filter((item: IAttraction) => regText?.test(item.name))
        if (likelyTodos) setCurrentAttraction(likelyTodos);
    }, [text]);


    return(
        <div className="suggest-input-and-list__wrapper">
            <input
                className="suggest-todo__input"
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Поиск" />
        </div>
    )
};

export default SearchInput;