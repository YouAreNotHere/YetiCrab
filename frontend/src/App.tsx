import './App.css'
import AttractionsList from "./features/AttractionsList/AttractionsList.tsx";
import {Button, ThemeProvider} from '@gravity-ui/uikit';
import {useEffect, useState} from "react";
import {IAttraction} from "./shared/types/IAttraction.ts";
import {useRequest} from "./shared/hooks/useRequest.ts";
import AttractionModal from "./features/AttractionModal/AttractionModal.tsx";
import SearchInput from "./features/SearchInput/SearchInput.tsx";

function App() {
    const [attractions, setAttractions] = useState<IAttraction[]>([]);
    const [currentAttractions, setCurrentAttractions] = useState<IAttraction[]>([])
    const [isAddAttractionModalOpen, setIsAddAttractionModalOpen] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const { data, makeRequest } = useRequest({ method: "GET", url: "attractions" });

    useEffect(() => {
        makeRequest();
    }, []);

    useEffect(() => {
        if (!data) return;
        setAttractions(data);
    }, [data]);

  return (
    <>
        <ThemeProvider theme="light">
            <div className = "admin-button">
                <Button
                    view="outlined-info"
                    onClick={() => setIsAdminMode(!isAdminMode)}
                >
                    {isAdminMode ? "В режим пользователя" : "В режим администратора"}
                </Button>
                <Button
                    view = "action"
                    onClick={() => setIsAddAttractionModalOpen(!isAddAttractionModalOpen)}
                    className="add-attraction__button"
                    style = {isAdminMode ? {display: "flex"} : {display: "none"}}
                >
                    Добавить достопримечательность
                </Button>
            </div>

            <SearchInput
                attractions={attractions}
                setCurrentAttraction={setCurrentAttractions}/>
            {isAddAttractionModalOpen && <AttractionModal
                setAttractions={setAttractions}
                getAttractions={makeRequest}
                setIsModalOpen={setIsAddAttractionModalOpen}
                isModalOpen={isAddAttractionModalOpen}
            />}
            <AttractionsList
                attractions={attractions}
                setAttractions={setAttractions}
                currentAttractions={currentAttractions}
                isAdminMode={isAdminMode}
            />
        </ThemeProvider>
    </>
  )
}

export default App
