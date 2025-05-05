
import React from 'react';
import styles from './FunctionItem.module.css';
import { forwardRef } from 'react';
import Link from 'next/link';

type FunctionItemProps = {
  title?: string;
  icon?: string;
  href?: string;
  className?: string;
  scroll?: boolean;
}

const FunctionItem = forwardRef<HTMLDivElement, FunctionItemProps>(
<<<<<<< HEAD
  ({ title, icon, href = "", className = ""}, ref) => (
=======
  ({ title, icon, href = "", className = "" , scroll}, ref) => (
>>>>>>> 3874ad11fa3fa3618e2657e58826d9bfd12f0a8d
    <div className={`${styles.functionItem} ${className}`} ref={ref}>
      <Link href={href} className={styles.inner} scroll={false}>
        <div className={styles.icon}>
          {icon && (
            <img src={icon} alt={title} className={styles.icon_svg} />
          )}
        </div>
        <div className={styles.title}>{title}</div>
      </Link>
    </div>
  )
);
FunctionItem.displayName = 'FunctionItem';
export default FunctionItem;