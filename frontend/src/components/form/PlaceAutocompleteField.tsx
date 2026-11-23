import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Typography } from "@mui/material";
import axios from "axios";
import FormTextField from "./FormTextField";
import type { PlaceSuggestion, SelectedPlace } from "../../lib/geo";
import { getPlaceLocation, MIN_PLACE_QUERY_CHARS, searchPlaces } from "../../api/places";

const DEBOUNCE_MS = 300;

function ensureSession(ref: { current: string | null }): string {
  return (ref.current ??= newSessionToken());
}

function newSessionToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

type Props = {
  field: string;
  label: string;
  placeholder?: string;
  /** Text shown in the input (booking.from / booking.to). */
  value: string;
  /** Typing: text changed, selection (if any) is dropped by the parent. */
  onTextChange: (text: string) => void;
  /** Picked a suggestion: verified place with coordinates from our backend. */
  onSelect: (place: SelectedPlace) => void;
  sx?: object;
};

/**
 * Address input backed by Google Places (New) through our backend.
 * Min 3 chars, 300 ms debounce, one session token per field instance,
 * rotated after a pick (the Details call closes the billed session).
 */
export default function PlaceAutocompleteField({
  field,
  label,
  placeholder,
  value,
  onTextChange,
  onSelect,
  sx,
}: Props) {
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const sessionRef = useRef<string | null>(null);

  // Below 3 chars (or right after a pick) nothing is requested and nothing shown.
  const searchActive = dirty && value.trim().length >= MIN_PLACE_QUERY_CHARS;
  const visibleOptions = searchActive ? options : [];

  useEffect(() => {
    const q = value.trim();
    if (!dirty || q.length < MIN_PLACE_QUERY_CHARS) return;
    const ac = new AbortController();
    const t = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      searchPlaces({ q, session: ensureSession(sessionRef), signal: ac.signal })
        .then((res) => setOptions(res))
        .catch((e: unknown) => {
          if (axios.isCancel(e)) return;
          setOptions([]);
          setError(e instanceof Error ? e.message : "Échec de la recherche d’adresse");
        })
        .finally(() => {
          if (!ac.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(t);
      ac.abort();
    };
  }, [value, dirty]);

  const pick = (s: PlaceSuggestion) => {
    setError(null);
    getPlaceLocation({ placeId: s.placeId, session: ensureSession(sessionRef) })
      .then((location) => {
        sessionRef.current = null;
        setDirty(false);
        setOptions([]);
        onSelect({
          placeId: s.placeId,
          label: s.fullText || [s.label, s.secondaryText].filter(Boolean).join(", "),
          secondaryText: s.secondaryText || undefined,
          location,
        });
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Impossible de résoudre l’adresse sélectionnée");
      });
  };

  return (
    <Autocomplete<PlaceSuggestion, false, false, true>
      freeSolo
      options={visibleOptions}
      filterOptions={(x) => x}
      loading={searchActive && loading}
      loadingText="Recherche…"
      noOptionsText="Aucun résultat"
      inputValue={value}
      onInputChange={(_e, next, reason) => {
        if (reason === "input" || reason === "clear") {
          setDirty(true);
          if (!next.trim()) sessionRef.current = null;
          onTextChange(next);
        }
      }}
      onChange={(_e, next) => {
        if (next && typeof next !== "string") pick(next);
      }}
      getOptionLabel={(o) => (typeof o === "string" ? o : o.fullText || o.label)}
      isOptionEqualToValue={(a, b) => a.placeId === b.placeId}
      renderOption={(props, o) => {
        const { key, ...rest } = props as typeof props & { key: string };
        return (
          <Box component="li" key={key} {...rest}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {o.label}
              </Typography>
              {o.secondaryText ? (
                <Typography variant="caption" color="text.secondary">
                  {o.secondaryText}
                </Typography>
              ) : null}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <FormTextField
          {...params}
          field={field}
          fullWidth
          size="small"
          label={label}
          placeholder={placeholder}
          sx={sx}
          {...(error ? { error: true, helperText: error } : {})}
        />
      )}
    />
  );
}
