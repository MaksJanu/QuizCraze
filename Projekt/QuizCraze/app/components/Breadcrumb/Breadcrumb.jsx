'use client'

import * as React from 'react';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { usePathname } from 'next/navigation';

export default function BasicBreadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <div className="bg-[#f8fafc] shadow-sm py-3 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        aria-label="breadcrumbs"
        sx={{
          '--Breadcrumbs-gap': '8px',
          '--Icon-fontSize': '16px',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        <Link
          color="neutral"
          href="/"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              color: '#A7D129',
            },
          }}
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography
              key={to}
              sx={{
                color: '#374151',
                fontWeight: 500,
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              key={to}
              color="neutral"
              href={to}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: '#A7D129',
                },
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}