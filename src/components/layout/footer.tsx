import React from 'react';
import FooterClient from './footer-client';

interface FooterProps {
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
  };
}

export default function Footer({ blogSettings }: FooterProps) {
  return <FooterClient blogSettings={blogSettings} />;
}
