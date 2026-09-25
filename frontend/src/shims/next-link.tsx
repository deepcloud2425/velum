import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children?: React.ReactNode;
  className?: string;
  as?: string;
  replace?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, children, ...props }, ref) => {
  if (!href) return null;
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink ref={ref} to={href} {...(props as any)}>
      {children}
    </RouterLink>
  );
});

export default Link;
