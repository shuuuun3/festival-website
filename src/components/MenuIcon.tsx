"use client";

import { useRef } from "react";
import gsap from "gsap";
import styles from "./MenuIcon.module.css";

export default function MenuIcon() {
  const svg_Ref = useRef<SVGSVGElement>(null);
  const menuIcon_Ref = useRef<HTMLDivElement>(null);
  const content_Ref = useRef<HTMLDivElement>(null);
  const isOpen = useRef(false);

  function handleMenuClick() {
    if (!menuIcon_Ref.current || !content_Ref.current) return;

    isOpen.current = !isOpen.current;

    svg_Ref.current?.classList.toggle(styles.active);

    const targetRect = content_Ref.current.getBoundingClientRect();

    if (isOpen.current) {
      gsap.to(menuIcon_Ref.current, {
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: "20px",
        duration: 0.5,
        ease: "none",
        onComplete: () => {
          gsap.to(content_Ref.current, {
            opacity: 1,
            duration: 0.5,
            ease: "none",
          });

        }
      });
    } else {
      gsap.fromTo(
        menuIcon_Ref.current,
        { borderRadius: "20px" }, // 開始値
        {
          width: "60px",
          height: "60px",
          borderRadius: "100px", // 終了値
          duration: 0.5, // アニメーションをゆっくりにする
          ease: "none",
        }
      );

      gsap.to(content_Ref.current, {
        opacity: 0,
        duration: 0.5,
        ease: "none",
      });
    }
  }

  return (
    <div className={styles.menu_wrapper}>
      <div className={styles.menu_icon} ref={menuIcon_Ref}>
        <svg
          className={`${styles.ham} ${styles.hamRotate} ${styles.ham1}`}
          viewBox="0 0 100 100"
          width="60"
          ref={svg_Ref}
          onClick={handleMenuClick}
        >
          <path
            className={`${styles.line} ${styles.top}`}
            d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
          />
          <path
            className={`${styles.line} ${styles.middle}`}
            d="m 30,50 h 40"
          />
          <path
            className={`${styles.line} ${styles.bottom}`}
            d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
          />
        </svg>
      </div>

      {/* メニューコンテンツ */}
      <div className={styles.menu_content} ref={content_Ref}>
        <p>メニュー項目 1</p>
        <p>メニュー項目 2</p>
        <p>メニュー項目 3</p>
      </div>
    </div>
  );
}