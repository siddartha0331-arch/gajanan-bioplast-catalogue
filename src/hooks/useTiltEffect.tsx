import { useRef, useEffect } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export const useTiltEffect = <T extends HTMLElement>(
  options: TiltOptions = {}
) => {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * maxTilt;
      const rotateY = ((centerX - x) / centerX) * maxTilt;

      // Update CSS custom properties for glow effect
      const mouseX = (x / rect.width) * 100;
      const mouseY = (y / rect.height) * 100;
      element.style.setProperty("--mouse-x", `${mouseX}%`);
      element.style.setProperty("--mouse-y", `${mouseY}%`);

      animationFrameId = requestAnimationFrame(() => {
        const inner = element.querySelector(".tilt-card-inner") as HTMLElement;
        if (inner) {
          inner.style.transform = `
            perspective(${perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${scale})
          `;
        }
      });
    };

    const handleMouseLeave = () => {
      const inner = element.querySelector(".tilt-card-inner") as HTMLElement;
      if (inner) {
        inner.style.transform = `
          perspective(${perspective}px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
        `;
      }
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, speed]);

  return ref;
};
