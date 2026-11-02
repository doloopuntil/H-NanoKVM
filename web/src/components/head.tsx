import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Helmet, HelmetData } from 'react-helmet-async';

import { getWebTitle } from '@/api/vm.ts';
import { existToken } from '@/lib/cookie.ts';
import { HARDENED_NAME } from '@/lib/hardened.ts';
import { webTitleAtom } from '@/jotai/settings.ts';

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  const [webTitle, setWebTitle] = useAtom(webTitleAtom);

  useEffect(() => {
    if (!existToken()) return;

    getWebTitle().then((rsp) => {
      if (rsp.data?.title) {
        setWebTitle(rsp.data.title);
      }
    });
  }, [setWebTitle]);

  return (
    <Helmet
      helmetData={helmetData}
      title={webTitle ? webTitle : title ? `${title} - ${HARDENED_NAME}` : undefined}
      defaultTitle={webTitle}
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};
