import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center pt-32">
      <h1 className="text-2xl font-bold mb-4">{t('terms.title')}</h1>
      <ol className="text-secondary text-[17px] max-w-3xl leading-[30px] list-decimal pt-8 p-16 bg-glass rounded-lg mb-20 border border-gray-500">
        {t('terms.content', { returnObjects: true }).map((item, index) => (
          <li key={index}>
            <strong>{item.title}: </strong>
            {item.text}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Terms;
