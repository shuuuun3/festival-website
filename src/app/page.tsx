"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.css"
import Logo from "../components/Logo";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const home_wrapper_Ref = useRef<HTMLElement>(null);
  const title_wrapper_Ref = useRef<HTMLDivElement>(null);
  const search_wrapper_Ref = useRef<HTMLElement>(null);
  const guide_wrapper_Ref = useRef<HTMLElement>(null);
  const menu_icon_Ref = useRef<SVGSVGElement>(null);
  const logo_Ref = useRef<SVGSVGElement>(null);
  const logo_target_Ref = useRef<HTMLDivElement>(null);

  function handleMenuClick() {
    menu_icon_Ref.current?.classList.toggle(styles.active);
  }

  useEffect(() => {
    if (
      home_wrapper_Ref.current &&
      search_wrapper_Ref.current &&
      guide_wrapper_Ref.current &&
      logo_Ref.current &&
      logo_target_Ref.current &&
      title_wrapper_Ref.current
    ) {
      ScrollTrigger.create({
        trigger: home_wrapper_Ref.current,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });

      ScrollTrigger.create({
        trigger: search_wrapper_Ref.current,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });

      ScrollTrigger.create({
        trigger: guide_wrapper_Ref.current,
        start: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });

      gsap.fromTo(
        logo_Ref.current,
        { x: 0, y: 0 },
        {
          x: () => {
            const targetRect = logo_target_Ref.current!.getBoundingClientRect();
            const logoRect = logo_Ref.current!.getBoundingClientRect();
            return (
              targetRect.left +
              targetRect.width / 2 -
              (logoRect.left + logoRect.width / 2)
            );
          },
          y: () => {
            const targetRect = logo_target_Ref.current!.getBoundingClientRect();
            const logoRect = logo_Ref.current!.getBoundingClientRect();
            return (
              targetRect.top +
              targetRect.height / 2 -
              (logoRect.top + logoRect.height / 2)
            );
          },
          scale: 1.2,
          scrollTrigger: {
            trigger: title_wrapper_Ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      )

      gsap.fromTo(
        logo_Ref.current.querySelectorAll("path"),
        { fill: "#fff" },
        {
          fill: "#2A2948",
          scrollTrigger: {
            trigger: title_wrapper_Ref.current,
            start: "top top",
            end: "bottom top",
            toggleActions: "play none none reverse",
            scrub: 1.2,
          },
        }
      )

      const pElements = title_wrapper_Ref.current?.querySelectorAll("p");
      if (pElements) {
        const allSpans: HTMLElement[] = [];

        pElements.forEach((p, index) => {
          const text = p.textContent || "";
          p.innerHTML = "";
          text.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.display = "inline-block";
            p.appendChild(span);
            allSpans.push(span);
          });
        });

        gsap.fromTo(
          allSpans,
          { opacity: 1 },
          {
            opacity: 0,
            stagger: {
              each: 0.05,
              from: "start",
            },
            scrollTrigger: {
              trigger: title_wrapper_Ref.current,
              start: "top top",
              end: "center top",
              scrub: 1.2,
            },
          }
        );
      }
    }
  }, []);

  return (
    <div className={styles.main}>
      <section className={styles.home_wrapper} ref={home_wrapper_Ref}>
        <div className={styles.h}></div>
        <div className={styles.title_wrapper} ref={title_wrapper_Ref}>
          <div className={styles.title_content}>
            <div className={styles.title_image}></div>
            <div className={styles.title_text_wrapper}>
              <div className={styles.title_text_inner}>
                <Logo ref={logo_Ref} className={styles.title_logo} />
                <div className={styles.title_text}>
                  <p className="mincho">情熱が咲き誇り</p>
                  <p className="mincho">笑顔と活気が満ちる</p>
                  <p className="mincho">忘れられない青春の1ページ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.about_wrapper}>
          <div className={styles.logo_target} ref={logo_target_Ref}></div>
          <div className={styles.about_content}></div>
          <div className={styles.about_btn}>
            <a href="" className={styles.flipBtn}>
              <div className={styles.flipBtn_inner}>
                <div className={`${styles.flipBtn_front} ${styles.flipBtn_item}`}>BUTTON</div>
                <div className={`${styles.flipBtn_back} ${styles.flipBtn_item}`}>ABOUT JUNNI</div>
              </div>
            </a>
          </div>
        </div>

      </section>
      <section className={styles.search_wrapper} ref={search_wrapper_Ref}>

      </section>
      <section className={styles.guide_wrapper} ref={guide_wrapper_Ref}>

      </section>
    </div>
  );
}