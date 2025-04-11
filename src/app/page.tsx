"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.css"

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const home_wrapper_Ref = useRef<HTMLElement>(null);
  const search_wrapper_Ref = useRef<HTMLElement>(null);
  const guide_wrapper_Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (home_wrapper_Ref.current && search_wrapper_Ref.current && guide_wrapper_Ref.current) {
      ScrollTrigger.create({
        trigger: home_wrapper_Ref.current,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: true,
      });

      ScrollTrigger.create({
        trigger: search_wrapper_Ref.current,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: true,
      });

      ScrollTrigger.create({
        trigger: guide_wrapper_Ref.current,
        start: "bottom bottom",
        pin: true,
        pinSpacing: false,
        markers: true,
      });
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <header></header>
      <div className={styles.main}>
        <section className={`${styles.home_wrapper} ${styles.wrapper_section}`} ref={home_wrapper_Ref}>
          <div className={styles.home_inner}>
            <div className={styles.title}>
              div
            </div>
          </div>
        </section>
        <section className={`${styles.search_wrapper} ${styles.wrapper_section}`} ref={search_wrapper_Ref}>
          <div className={styles.search_inner}>

          </div>
        </section>
        <section className={`${styles.guide_wrapper} ${styles.wrapper_section}`} ref={guide_wrapper_Ref}>
          <div className={styles.guide_inner}>

          </div>
        </section>
      </div>
    </div>
  );
}
