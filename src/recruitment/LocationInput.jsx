import React from "react";
import * as Geoapify from "@geoapify/react-geocoder-autocomplete";
import { useTranslation } from "react-i18next";

const LocationInput = ({ formData, setFormData, errors }) => {
  const { t } = useTranslation();
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const handlePlaceSelect = (place) => {
    if (place && place.properties) {
      setFormData({
        ...formData,
        location: place.properties.formatted,
      });
    }
  };

  return (
    <div className="relative space-y-2">
      <label className="block text-sm font-medium text-gray-300">
      {t("Recruitment Edit.Location")}
        </label>
      <Geoapify.GeoapifyContext apiKey={apiKey}>
        <div className="relative">
          {Geoapify.GeoapifyGeocoderAutocomplete ? (
            <Geoapify.GeoapifyGeocoderAutocomplete
              placeholder={"⠀"}
              placeSelect={handlePlaceSelect}
              debounce={300}
              lang={t("lang")}
              value={formData.location}
            />
          ) : (
            <p className="text-red-500">Geoapify component not found!</p>
          )}
        </div>
      </Geoapify.GeoapifyContext>
    </div>
  );
};

export default LocationInput;
