import { useEffect, useState, useCallback } from "react";
import { GeoCoords } from "@/types/washType";
import { fallbackCords } from "@/mockupData/washData";

const GEO_PERMISSION_DENIED = 1;
const GEO_POSITION_UNAVAILABLE = 2;

export const useGeoLocation = () => {

  // state til at gemme geokoordinater, loading state og fejl
  const [coords, setCoords] = useState<GeoCoords | null>(null);

  // state til loading
  const [isLoading, setIsLoading] = useState(true);

  // state til fejl
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  // state til at vise om bruger skal tillade lokation
  const [locationPermissionState, setLocationPermissionState] = useState<"ok" | "tillad lokation">("ok");

  // toggle bruges til at trigge ny geolocation-kørsel (remount-lignende flow)
  const [remountToggle, setRemountToggle] = useState(false);

  // funktion til at hente geokoordinater, med retry logik ved midlertidige fejl
  const getPosition = useCallback((retry = 0) => {

    // hvis der ikke findes geolocation API
    if (!navigator.geolocation) {

      // brug fallback koordinater - defineret i mockupData/washData.ts
      setCoords(fallbackCords);

      // stop loading
      setIsLoading(false);

      return;
    }

    // brug geolocation API til at få brugerens position
    navigator.geolocation.getCurrentPosition(
      (position) => {

        // set koordinater i state
        setCoords({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

          // brug source til at indikere hvor koordinaterne kommer fra, for bedre fejlhåndtering og debugging
          source: "gps",
        });

        setIsLoading(false);

        setError(null);
        setLocationPermissionState("ok");
      },

      (err) => {
        console.log("Geo error:", err);

        // retry kun ved midlertidige fejl
        if (
          err.code === GEO_POSITION_UNAVAILABLE &&

          // tillad op til 2 retries med en kort delay imellem, for at håndtere midlertidige GPS fejl
          retry < 2
        ) {
          // tilføj en delay før næste retry, for at give GPS tid til at stabilisere sig - god til mobile enheder
          setTimeout(() => getPosition(retry + 1), 1500);

          return;
        }

        // fallback
        setCoords(fallbackCords);
        setError(err);

        if (err.code === GEO_PERMISSION_DENIED) {
          setLocationPermissionState("tillad lokation");
        } else {
          setLocationPermissionState("ok");
        }

        setIsLoading(false);
      },

      {
        // høj nøjagtighed for bedre resultater, især vigtigt for at finde nærmeste vaskehal
        enableHighAccuracy: true,
        // timeout for at undgå at vente for længe på GPS svar, især på mobile enheder
        timeout: 15000,
        // cache resultater i 10 minutter for at undgå unødvendige GPS forespørgsler og forbedre performance
        maximumAge: 600000,
      },
    );
  }, []);

  const retryGeolocation = useCallback(() => {
    setIsLoading(true);
    getPosition();
  }, [getPosition]);

  const toggleGeolocationRemount = useCallback(() => {
    setRemountToggle((prev) => !prev);
  }, []);

  useEffect(() => {
    retryGeolocation();
  }, [retryGeolocation, remountToggle]);

  useEffect(() => {
    // forsøg kun igen automatisk, hvis bruger tidligere har afvist lokation
    if (error?.code !== GEO_PERMISSION_DENIED) return;

    const retryIfVisible = () => {
      if (document.visibilityState === "visible") {
        toggleGeolocationRemount();
      }
    };

    const retryOnFocus = () => {
      toggleGeolocationRemount();
    };

    window.addEventListener("focus", retryOnFocus);
    document.addEventListener("visibilitychange", retryIfVisible);

    return () => {
      window.removeEventListener("focus", retryOnFocus);
      document.removeEventListener("visibilitychange", retryIfVisible);
    };
  }, [error, toggleGeolocationRemount]);

  return {
    coords,
    isLoading,
    error,
    locationPermissionState,
    toggleGeolocationRemount,
  };
};