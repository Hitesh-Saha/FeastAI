import React from 'react'
import Header from '@/components/header/Header';

const MainSectionLayout = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="bg-base text-base-foreground rounded-3xl">
      <Header />
      {children}
    </section>
  )
}

export default MainSectionLayout