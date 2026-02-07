import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

const HOTEL_COORDS = [45.3225, 37.2685];
const MAP_ZOOM = 16;

export function YandexMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    function initMap() {
      if (!containerRef.current || mapRef.current) return;

      const map = new window.ymaps.Map(containerRef.current, {
        center: HOTEL_COORDS,
        zoom: MAP_ZOOM,
        controls: ["zoomControl"],
      }, {
        suppressMapOpenBlock: true,
      });

      map.behaviors.enable(["drag", "scrollZoom", "multiTouch"]);

      const placemark = new window.ymaps.Placemark(HOTEL_COORDS, {}, {
        preset: "islands#blueHotelIcon",
        iconColor: "#0891b2",
      });

      map.geoObjects.add(placemark);
      mapRef.current = map;
    }

    if (window.ymaps && window.ymaps.Map) {
      window.ymaps.ready(initMap);
      return;
    }

    const existing = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existing) {
      window.ymaps.ready(initMap);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(initMap);
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={className} data-testid="contacts-map" />;
}
