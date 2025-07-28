import React from 'react';
import { useTranslation } from 'react-i18next';

const SwitchStatus = ({ status, setStatus, setPage }) => {
    const {t} = useTranslation();

    const statusNames = [ t('All'), t('Open'), t('In Progress'), t('Closed')];

    return (
        <div role="tablist" className="tabs tabs-lift filters">
            {
                statusNames.map((title, index) =>
                    index - 1 == status
                        ? <div key={index} role="tab" className="tab tab-active"><h4>{title}</h4></div>
                        : <div key={index} role="tab" className="tab" onClick={e => { setStatus(index - 1); setPage(1) }}><h4>{title}</h4></div>
                )
            }
        </div>
    )

};

export default SwitchStatus;