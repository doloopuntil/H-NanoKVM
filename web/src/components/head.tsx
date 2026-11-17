import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { getWebTitle } from '@/api/vm.ts';
import { existToken } from '@/lib/cookie.ts';
import { HARDENED_NAME } from '@/lib/hardened.ts';
import { webTitleAtom } from '@/jotai/settings.ts';

type HeadProps = {
  title?: string;
};

export const Head = ({ title = '' }: HeadProps = {}) => {
  const [webTitle, setWebTitle] = useAtom(webTitleAtom);

  useEffect(() => {
    if (!existToken()) return;

    getWebTitle().then((rsp) => {
      if (rsp.data?.title) {
        setWebTitle(rsp.data.title);
      }
    });
  }, [setWebTitle]);

  const pageTitle = webTitle || (title ? `${title} - ${HARDENED_NAME}` : '');
  useEffect(() => {
    if (pageTitle) document.title = pageTitle;
  }, [pageTitle]);

  return null;
};
