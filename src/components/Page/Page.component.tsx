import { FC, PropsWithChildren } from 'react';
import './Page.component.css';

export const AppPage: FC<PropsWithChildren & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={ `app-page ${className}` } { ...props } >{ children }</div>
);
