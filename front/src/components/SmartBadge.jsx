import React from 'react';
import { useTranslation } from 'react-i18next';

const SmartBadge = ({status}) => {
    const {t} = useTranslation();

    if (status == 0)
        return (
            <div className="badge badge-success">
                {t('Open')}
            </div>
        )

    if (status == 1)
        return (
            <div className="badge badge-warning">
                {t('In Progress')}
            </div>
        )

    if (status == 2)
        return (
            <div className="badge badge-error">
                {t('Closed')}
            </div>
        )

};

export default SmartBadge;



