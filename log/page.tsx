"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./page.module.css"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useEffect(() => {
    // GSAPタイムラインの作成
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles.parallax}`,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    })

    // 各要素のアニメーション設定
    timeline
      // .fromTo(`.${styles.sky}`, { y: 0 }, { y: -200 }, 0)
      .fromTo(`.${styles.cloud1}`, { y: 100+400 }, { y: -800 }, 0)
      .fromTo(`.${styles.cloud2}`, { y: -250+400 }, { y: -1000 }, 0)
      .fromTo(`.${styles.cloud3}`, { y: -50+400 }, { y: -2000 }, 0)
      .fromTo(`.${styles.mountBg}`, { y: -10+400 }, { y: -100 }, 0)
      .fromTo(`.${styles.mountMg}`, { y: -80+400 }, { y: -1000 }, 0)
      .fromTo(`.${styles.mountFg}`, { y: -60+400 }, { y: -2500 }, 0)
      .fromTo(`.${styles.cloudMask}`, { y: 450 }, { y: -3000 }, 0)
      .fromTo(`.${styles.box}`, { y: 450-1 }, { y: -3000 }, 0)
  }, [])

  return (
    <div className={styles.layout_inner}>
      <div className={styles.container}>
        <div className={styles.parallax}>
          <div className={styles.sky}>
            <p className={styles.festivalName}>青霞祭</p>
          </div>
          <div className={styles.mountBg}></div>
          <div className={styles.mountMg}></div>
          <div className={styles.cloud2}></div>
          <div className={styles.mountFg}></div>
          <div className={styles.cloud1}></div>
          <div className={styles.cloud3}></div>
          <div className={styles.cloudMask}></div>
          <div className={styles.box}></div>
        </div>
        <div className={styles.maskedText}>
          <p>aa</p>
        </div>
      </div>
    </div>
  );
}
