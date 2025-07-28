import React, { use } from 'react';
import { useTranslation } from 'react-i18next';

const SwitchPage = ({page, setPage}) => {

    const {t} = useTranslation();

    function LeftClickPage()
    {
        if(page == 1)
            return;
        setPage(page => page - 1);
    }

    function RightClickPage()
    {
        setPage(page => page + 1);
    }

    return(
        <div className="join pagination">
            <button className="join-item btn" onClick={e => LeftClickPage()}>«</button>
            <button className="join-item btn page-button">{t('Page')} {page}</button>
            <button className="join-item btn" onClick={e => RightClickPage()}>»</button>
        </div>
    )

};

export default SwitchPage;