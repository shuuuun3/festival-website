import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 任意の要素に一文字ずつ下から現れるアニメーションを適用
 * @param el 対象のHTMLElement
 * @param options GSAPやScrollTriggerのオプション（必要に応じて拡張可）
 */
export function animateTextByChar(
  el: HTMLElement,
  options?: {
    triggerStart?: string;
    stagger?: number;
    duration?: number;
    ease?: string;
  }
) {
  if (!el) return;
  const text = el.textContent || "";
  el.innerHTML = "";
  const spans: HTMLElement[] = [];
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.transform = "translateY(100%)";
    span.style.opacity = "0";
    el.appendChild(span);
    spans.push(span);
  });

  gsap.to(spans, {
    y: 0,
    opacity: 1,
    stagger: options?.stagger ?? 0.07,
    duration: options?.duration ?? 0.5,
    ease: options?.ease ?? "power2.out",
    scrollTrigger: {
      trigger: el,
      start: options?.triggerStart ?? "bottom bottom",
      toggleActions: "play none none reverse",
    },
  });
}