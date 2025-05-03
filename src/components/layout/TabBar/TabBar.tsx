"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./TabBar.module.css";

export default function TabBar() {
  const tabBar_Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleSearchWrapperReady(e: CustomEvent) {
      const triggerEl = e.detail as HTMLElement;
      if (tabBar_Ref.current && triggerEl) {
        gsap.set(tabBar_Ref.current, { opacity: 0, y: 100 });
        gsap.to(tabBar_Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          // ease: "power2.out",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top top",
            toggleActions: "play none none reverse",
          },
        });
      }
    }
    window.addEventListener("searchWrapperReady", handleSearchWrapperReady as EventListener);
    return () => {
      window.removeEventListener("searchWrapperReady", handleSearchWrapperReady as EventListener);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={tabBar_Ref}>
      <div className={styles.items}>
        <a className={`${styles.item} ${styles.pamphlet}`} href="/function/pamphlet">
          <img src="/icon/pamphlet.svg" alt="pamphlet" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.timetable}`} href="/function/timetable">
          <img src="/icon/timetable.svg" alt="timetable" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.search}`} href="">
          <img src="/icon/search.svg" alt="search" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.user}`} href="">
          <img src="/icon/user.svg" alt="user" className={styles.icon_svg} />
        </a>
        <a className={`${styles.item} ${styles.allEvents}`} href="/function/allEvents">
          <img src="/icon/allEvents_tabbar.svg" alt="allEvents" className={styles.icon_svg} />
        </a>
      </div>
    </div>
  );
}