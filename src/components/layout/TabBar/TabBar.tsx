"use client"

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./TabBar.module.css";
import { forwardRef } from 'react';

const TabBar = forwardRef<HTMLDivElement>(
  () => (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <a className={`${styles.item} ${styles.pamphlet}`} href="">
          <img src="/icon/pamphlet.svg" alt="pamphlet" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.timetable}`} href="">
          <img src="/icon/timetable.svg" alt="timetable" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.search}`} href="">
          <img src="/icon/search.svg" alt="search" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.user}`} href="">
          <img src="/icon/user.svg" alt="user" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.allEvents}`} href="">
          <img src="/icon/allEvents_tabbar.svg" alt="allEvents" className={styles.icon_svg} />
        </a>
      </div>
    </div>
  )
);

export default TabBar;