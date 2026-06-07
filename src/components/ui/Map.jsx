import React, {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useCallback
} from "react";
import { createPortal } from "react-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

// Check document class for theme
function getDocumentTheme() {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

// Get system preference
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useResolvedTheme(themeProp) {
  const [detectedTheme, setDetectedTheme] = useState(
    () => themeProp ?? getDocumentTheme() ?? getSystemTheme()
  );

  useEffect(() => {
    if (themeProp) {
      setDetectedTheme(themeProp);
      return;
    }

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) {
        setDetectedTheme(docTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

const MapContext = createContext(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

function getViewport(map) {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

export const Map = forwardRef(function Map(
  {
    children,
    className = "",
    theme: themeProp,
    styles,
    projection,
    viewport,
    onViewportChange,
    loading = false,
    center = [78.9629, 20.5937],
    zoom = 5,
    bearing = 0,
    pitch = 0,
    onClick,
    ...props
  },
  ref
) {
  const containerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const currentStyleRef = useRef(null);
  const styleTimeoutRef = useRef(null);
  const internalUpdateRef = useRef(false);
  const resolvedTheme = useResolvedTheme(themeProp);

  const isControlled = viewport !== undefined && onViewportChange !== undefined;

  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  );

  useImperativeHandle(ref, () => mapInstance, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const initialStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    currentStyleRef.current = initialStyle;

    const mapOptions = {
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: false,
      center: isControlled && viewport?.center ? viewport.center : center,
      zoom: isControlled && viewport?.zoom !== undefined ? viewport.zoom : zoom,
      bearing: isControlled && viewport?.bearing !== undefined ? viewport.bearing : bearing,
      pitch: isControlled && viewport?.pitch !== undefined ? viewport.pitch : pitch,
      ...props,
    };

    const map = new maplibregl.Map(mapOptions);

    const styleDataHandler = () => {
      clearStyleTimeout();
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
        if (projection) {
          map.setProjection(projection);
        }
      }, 100);
    };

    const loadHandler = () => setIsLoaded(true);

    const handleMove = () => {
      if (internalUpdateRef.current) return;
      onViewportChangeRef.current?.(getViewport(map));
    };

    map.on("load", loadHandler);
    map.on("styledata", styleDataHandler);
    map.on("move", handleMove);

    if (onClick) {
      map.on("click", (e) => {
        onClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });
    }

    setMapInstance(map);

    return () => {
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.off("styledata", styleDataHandler);
      map.off("move", handleMove);
      map.remove();
      setIsLoaded(false);
      setIsStyleLoaded(false);
      setMapInstance(null);
    };
  }, []);

  // Sync controlled viewport to map
  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return;
    if (mapInstance.isMoving()) return;

    const current = getViewport(mapInstance);
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    };

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return;
    }

    internalUpdateRef.current = true;
    mapInstance.jumpTo(next);
    internalUpdateRef.current = false;
  }, [mapInstance, isControlled, viewport]);

  // Handle center/zoom updates when uncontrolled
  useEffect(() => {
    if (!mapInstance || isControlled || !isLoaded) return;
    const currentCenter = mapInstance.getCenter();
    if (currentCenter.lng !== center[0] || currentCenter.lat !== center[1]) {
      mapInstance.setCenter(center);
    }
  }, [center, mapInstance, isControlled, isLoaded]);

  useEffect(() => {
    if (!mapInstance || isControlled || !isLoaded) return;
    const currentZoom = mapInstance.getZoom();
    if (currentZoom !== zoom) {
      mapInstance.setZoom(zoom);
    }
  }, [zoom, mapInstance, isControlled, isLoaded]);

  // Handle style change when theme resolves
  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return;

    const newStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    if (currentStyleRef.current === newStyle) return;

    clearStyleTimeout();
    currentStyleRef.current = newStyle;
    setIsStyleLoaded(false);
    mapInstance.setStyle(newStyle, { diff: true });
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded]
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div ref={containerRef} className={`relative w-full h-full ${className}`}>
        {(!isLoaded || loading) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-xs">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-stone-500/60 animate-pulse rounded-full" />
              <span className="w-1.5 h-1.5 bg-stone-500/60 animate-pulse rounded-full [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-stone-500/60 animate-pulse rounded-full [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});

export const Marker = ({ longitude, latitude, children }) => {
  const { map, isLoaded } = useMap();
  const markerRef = useRef(null);
  const [portalEl, setPortalEl] = useState(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const el = document.createElement("div");
    el.style.width = "auto";
    el.style.height = "auto";

    if (!children) {
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" width="32" height="32" style="filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3)); cursor: pointer;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;
    }

    setPortalEl(el);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map, isLoaded, longitude, latitude]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  if (children && portalEl) {
    return createPortal(children, portalEl);
  }

  return null;
};
