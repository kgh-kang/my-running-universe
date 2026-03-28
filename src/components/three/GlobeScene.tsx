import { useRef, useEffect, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RunningPath } from '../../types/strava';
import { useStore } from '../../store/useStore';

interface Props {
  paths: RunningPath[];
}

const DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export default function GlobeScene({ paths }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const selectedPath = useStore((s) => s.selectedPath);
  const setSelectedPath = useStore((s) => s.setSelectedPath);

  // 초기 중심점 계산
  const initialCenter = useMemo((): [number, number] => {
    if (paths.length > 0 && paths[0].coordinates.length > 0) {
      const first = paths[0].coordinates[0];
      return [first[1], first[0]]; // [lng, lat]
    }
    return [127, 37.5]; // 서울
  }, [paths]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: DARK_STYLE,
      center: initialCenter,
      zoom: 11,
      pitch: 0,
      maxZoom: 18,
      minZoom: 1,
      renderWorldCopies: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      addPathsToMap(map, paths, selectedPath);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 경로 데이터 업데이트
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    addPathsToMap(map, paths, selectedPath);
  }, [paths, selectedPath]);

  function addPathsToMap(
    map: maplibregl.Map,
    paths: RunningPath[],
    selected: RunningPath | null,
  ) {
    // 기존 레이어/소스 제거
    paths.forEach((_, i) => {
      const glowId = `path-glow-${i}`;
      const lineId = `path-line-${i}`;
      const srcId = `path-source-${i}`;
      if (map.getLayer(glowId)) map.removeLayer(glowId);
      if (map.getLayer(lineId)) map.removeLayer(lineId);
      if (map.getSource(srcId)) map.removeSource(srcId);
    });

    // 경로 추가
    paths.forEach((path, i) => {
      const srcId = `path-source-${i}`;
      const glowId = `path-glow-${i}`;
      const lineId = `path-line-${i}`;
      const isSelected = selected?.id === path.id;
      const isAnySelected = selected !== null;
      const opacity = isAnySelected ? (isSelected ? 1 : 0.15) : 0.85;

      const coordinates = path.coordinates.map(([lat, lng]) => [lng, lat]);

      map.addSource(srcId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        },
      });

      // 글로우 효과 (아래에 두꺼운 반투명 선)
      map.addLayer({
        id: glowId,
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': path.color,
          'line-width': isSelected ? 10 : 6,
          'line-opacity': opacity * 0.3,
          'line-blur': 6,
        },
      });

      // 실제 경로 선
      map.addLayer({
        id: lineId,
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': path.color,
          'line-width': isSelected ? 4 : 2.5,
          'line-opacity': opacity,
        },
      });

      // 클릭 이벤트
      map.on('click', lineId, () => {
        setSelectedPath(selected?.id === path.id ? null : path);
      });

      map.on('mouseenter', lineId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', lineId, () => {
        map.getCanvas().style.cursor = '';
      });
    });

    // 선택된 경로로 이동
    if (selected && selected.coordinates.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      selected.coordinates.forEach(([lat, lng]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, { padding: 60, duration: 1000 });
    }
  }

  return <div ref={mapContainer} className="globe-map" />;
}
