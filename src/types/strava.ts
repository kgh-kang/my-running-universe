export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile_medium: string;
  profile: string;
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaMap {
  id: string;
  summary_polyline: string;
  polyline?: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  map: StravaMap;
  average_speed: number;
  max_speed: number;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  start_latlng: [number, number] | [];
  end_latlng: [number, number] | [];
}

export interface RunningPath {
  id: number;
  name: string;
  date: string;
  distance: number;
  duration: number;
  avgSpeed: number;
  coordinates: [number, number][];
  color: string;
}
