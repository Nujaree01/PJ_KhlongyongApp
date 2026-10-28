import { useEffect, useState } from "react";
import { PLACES, Place } from "../data/places";
import {
  subscribeToPlaceOverrides,
  PlaceOverridesMap,
} from "../services/placesRemote";

export function useLivePlaces(): { places: Place[]; loading: boolean } {
  const [overrides, setOverrides] = useState<PlaceOverridesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPlaceOverrides(
      (data) => {
        setOverrides(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  const places: Place[] = PLACES.map((base) => {
    const o = overrides[base.id];
    if (!o) return base;

    return {
      ...base,
      order: o.order ?? base.order,
      name: o.name || base.name,
      nameEn: o.nameEn || base.nameEn,
      category: o.category || base.category,
      latitude: o.latitude ?? base.latitude,
      longitude: o.longitude ?? base.longitude,
      description: o.description || base.description,
      highlight: o.highlight || base.highlight,
      tips: o.tips && o.tips.length > 0 ? o.tips : base.tips,
      openHours: o.openHours || base.openHours,
      phone: o.phone || base.phone,
      image: o.imageUrl ? { uri: o.imageUrl } : base.image,
    };
  });

  return { places, loading };
}
