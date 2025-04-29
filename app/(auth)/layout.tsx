import MainSectionLayout from '@/components/main-section/MainSectionLayout';
import React from 'react'

const layout = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <MainSectionLayout>
      {children}
    </MainSectionLayout>
  )
}

export default layout