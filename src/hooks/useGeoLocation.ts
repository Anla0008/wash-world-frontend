import { useEffect, useState, useCallback } from "react";

type GeoCoords = {
  latitude: number;
  longitude: number;
  source: "gps" | "fallback";
};

const FALLBACK_COORDS: GeoCoords = {
  latitude: 55.6761,
  longitude: 12.5683,
  source: "fallback",
};

export const useGeoLocation = () => {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] =
    useState<GeolocationPositionError | null>(null);

  const getPosition = useCallback((retry = 0) => {
    if (!navigator.geolocation) {
      setCoords(FALLBACK_COORDS);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: "gps",
        });

        setIsLoading(false);
        setError(null);
      },

      (err) => {
        console.log("Geo error:", err);

        // retry kun ved midlertidige fejl
        if (
          err.code === err.POSITION_UNAVAILABLE &&
          retry < 2
        ) {
          setTimeout(() => getPosition(retry + 1), 1500);
          return;
        }

        // fallback
        setCoords(FALLBACK_COORDS);
        setError(err);
        setIsLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000,
      },
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return {
    coords,
    isLoading,
    error,
  };
};