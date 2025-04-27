
import React from 'react';
import styles from './FunctionItem.module.css';
import { forwardRef } from 'react';

type FunctionItemProps = {
  title?: string;
  icon?: string;
  href?: string;
  className?: string;
}

const FunctionItem = forwardRef<HTMLDivElement, FunctionItemProps>(
  ({ title, icon, href = "", className = "" }, ref) => (
    <div className={`${styles.functionItem} ${className}`} ref={ref}>
      <a href={href} className={styles.inner}>
        <div className={styles.icon}>
          {icon && (
            <img src={icon} alt={title} className={styles.icon_svg} />
          )}
        </div>
        <div className={styles.title}>{title}</div>
      </a>
    </div>
  )
);

export default FunctionItem;