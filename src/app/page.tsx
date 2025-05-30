"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.css"
import Logo from "../components/Logo";
import FlipButton from "../components/layout/FlipButton/FlipButton";
import FunctionItem from "../components/home/FunctionItem/FunctionItem";
import { animateTextByChar } from "../utils/animateTextByChar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const home_wrapper_Ref = useRef<HTMLElement>(null);
  const title_wrapper_Ref = useRef<HTMLDivElement>(null);
  const search_wrapper_Ref = useRef<HTMLElement>(null);
  const guide_wrapper_Ref = useRef<HTMLElement>(null);
  const logo_Ref = useRef<SVGSVGElement>(null);
  const logo_target_Ref = useRef<HTMLDivElement>(null);
  const search_title_Ref = useRef<HTMLHeadingElement>(null);
  const function_map_Ref = useRef<HTMLDivElement>(null);
  const function_timetable_Ref = useRef<HTMLDivElement>(null);
  const function_allEvents_Ref = useRef<HTMLDivElement>(null);
  const function_pamphlet_Ref = useRef<HTMLDivElement>(null);
  const eventSearch_Ref = useRef<HTMLDivElement>(null);
  const mainContext = useRef<gsap.Context | null>(null); // gsap.context 用の ref

  useEffect(() => {
    if (
      home_wrapper_Ref.current &&
      search_wrapper_Ref.current &&
      guide_wrapper_Ref.current &&
      logo_Ref.current &&
      logo_target_Ref.current &&
      title_wrapper_Ref.current &&
      search_title_Ref.current &&
      function_map_Ref.current &&
      function_timetable_Ref.current &&
      function_allEvents_Ref.current &&
      function_pamphlet_Ref.current &&
      eventSearch_Ref.current
    ) {
      // gsap.context を使用してアニメーションと ScrollTrigger を管理
      mainContext.current = gsap.context(() => {
        ScrollTrigger.create({
          trigger: home_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: search_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: guide_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
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
              trigger: title_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        )

        gsap.fromTo(
          logo_Ref.current!.querySelectorAll("path"), // Non-null assertion operator (!) を追加
          { fill: "#fff" },
          {
            fill: "#2A2948",
            scrollTrigger: {
              trigger: title_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
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

          pElements.forEach((p) => {
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
                trigger: title_wrapper_Ref.current!, // Non-null assertion operator (!) を追加
                start: "top top",
                end: "center top",
                scrub: 1.2,
              },
            }
          );
        }

        if (search_title_Ref.current) {
          animateTextByChar(search_title_Ref.current, {
            triggerStart: "bottom bottom",
          })
        }

        const functionItems = [
          function_map_Ref.current,
          function_timetable_Ref.current,
          function_allEvents_Ref.current,
          function_pamphlet_Ref.current,
          eventSearch_Ref.current,
        ];

        // 初期状態を透明に
        gsap.set(functionItems, { opacity: 0, y: 40 });

        gsap.timeline({
          scrollTrigger: {
            trigger: search_title_Ref.current!, // Non-null assertion operator (!) を追加
            start: "top center",
            toggleActions: "play none none reverse",
          },
        })
          .to(functionItems, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
          });

        window.dispatchEvent(
          new CustomEvent("searchWrapperReady", { detail: search_wrapper_Ref.current! }) // Non-null assertion operator (!) を追加
        );
      }, home_wrapper_Ref); // スコープを指定
    }

    // クリーンアップ関数
    return () => {
      mainContext.current?.revert(); // context 内のすべてのアニメーションと ScrollTrigger を kill
    };
  }, []); // 依存配列は空のまま

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
            <FlipButton front="LEAN MORE" back="LEAN MORE" />
          </div>
        </div>

      </section>
      <section className={styles.search_wrapper} ref={search_wrapper_Ref}>
        <div className={styles.search_inner}>
          <h2 className={styles.search_title} ref={search_title_Ref}>SEARCH</h2>
          <div className={styles.function_wrapper}>
            <div className={styles.functionItems}>
              <FunctionItem href="/function/map" className="function_map" title="マップ" icon="/icon/map.svg" ref={function_map_Ref} scroll={false}></FunctionItem>
              <FunctionItem href="/function/timetable" className="function_timetable" title="タイムテーブル" icon="/icon/timetable.svg" ref={function_timetable_Ref} scroll={false}></FunctionItem>
              <FunctionItem href="/function/allEvents" className="function_allEvents" title="企画一覧" icon="/icon/allEvents.svg" ref={function_allEvents_Ref} scroll={false}></FunctionItem>
              <FunctionItem href="/function/pamphlet" className="function_pamphlet" title="パンフレット" icon="/icon/pamphlet.svg" ref={function_pamphlet_Ref} scroll={false}></FunctionItem>
            </div>
            <div className={styles.eventSearch} ref={eventSearch_Ref}>
              <a href="">
                <div className={styles.eventSearch_inner}>
                  <div className={styles.icon_wrapper}>
                    <img src="/icon/search.svg" alt="search" className={styles.search_icon} />
                  </div>
                  <p>企画検索</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.guide_wrapper} ref={guide_wrapper_Ref}>

      </section>
    </div>
  );
}