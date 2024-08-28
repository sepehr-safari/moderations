import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';

import { ThemeProvider } from '@/shared/components/theme-provider';

export const Providers = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};