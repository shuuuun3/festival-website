"use client";

import { useEffect, useRef } from "react";
import styles from "./EventContent_client.module.css";

interface Event {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl: string;
}

export default function EventContent_client({ events }: { events: Event[] }) {
  const title_Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {

    if (title_Ref.current) {
    }

  }, []);

  const handleClick = (event: Event) => {
    alert(`イベント: ${event.title} をクリックしました`);
    // 必要ならルーティングや詳細表示もここで
  };

  return (
    <div>
      <h2 ref={title_Ref}>イベント一覧</h2>
      <ul>
        {events.map((event) => (
          <li
            key={event.id}
            className={styles.eventItem}
            onClick={() => handleClick(event)}
            style={{ cursor: "pointer" }}
          >
            {event.title} - {event.subtitle}
          </li>
        ))}
      </ul>
    </div>
  );
}