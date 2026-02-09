import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

const HOTEL_COORDS = [45.326978, 37.290373];
const MAP_ZOOM = 15;
const YANDEX_TRAVEL_URL = "https://travel.yandex.ru/hotels/anapa/al-mare-otel-2919830429/";

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
        suppressObsoleteBrowserNotifier: true,
      });

      map.behaviors.enable(["drag", "scrollZoom", "multiTouch"]);
      map.behaviors.disable(["rightMouseButtonMagnifier"]);

      const placemark = new window.ymaps.Placemark(HOTEL_COORDS, {
        hintContent: "AL MARE — открыть на Яндекс Путешествиях",
      }, {
        preset: "islands#blueHotelIcon",
        iconColor: "#0891b2",
        hasBalloon: false,
        hasHint: true,
        openBalloonOnClick: false,
        cursor: "pointer",
      });

      placemark.events.add("click", () => {
        window.open(YANDEX_TRAVEL_URL, "_blank", "noopener,noreferrer");
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
