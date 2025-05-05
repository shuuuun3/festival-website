"use client"

import styles from "./timetable_client.module.css";
import { useEffect, useRef } from "react";
import { animateTextByChar } from "@/src/utils/animateTextByChar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Timetable_Client({
  serverPart,
}: {
  serverPart: React.ReactNode;
}) {
  const title_Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (title_Ref.current) {
      animateTextByChar(title_Ref.current, {
        triggerStart: "top 80%",
        triggerEnd: "top top",
        toggleActions: "play reverse play reverse",
      })
    }
  }, [])

  return (
    <div className={styles.main}>
      <h2 className={styles.title} ref={title_Ref}>TIME TABLE</h2>
      <div className={styles.serverPart}>
        {serverPart}
      </div>
      <div className={styles.wrapper}></div>
    </div>
  );
}


      // <ul>
      //   {events.map((event) => (
      //     <li key={event.id}>
      //       {event.title} - {event.subtitle} - {event.description} - ({event.startDate?.toString() ?? "日付未定"} - {event.endDate?.toString() ?? "日付未定"}) - {event.location} - {event.imageUrl}
      //     </li>
      //   ))}
      // </ul>