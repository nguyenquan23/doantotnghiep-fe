/* eslint-disable @typescript-eslint/no-unused-vars */
import { LatLng, LatLngExpression, divIcon, point } from 'leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet/dist/leaflet.css'
import { memo, useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Location } from 'src/types/location.type'
import MapSearchControl from '../MapSearchControl/MapSearchControl'
import './react-leaflet.css'

interface MapProps {
  onMarkersUpdate: (markers: LatLngExpression[]) => void
  selectMode?: boolean
  locations?: Location[]
  changeMapViewMode?: boolean
  removeMode?: boolean
}

const Map: React.FC<MapProps> = memo(
  ({ onMarkersUpdate, selectMode = false, removeMode = true, changeMapViewMode = true, locations }: MapProps) => {
    const [centerLocation, setCenterLocation] = useState<LatLngExpression>([16.047079, 108.20623])
    const [markers, setMarkers] = useState<LatLngExpression[]>([])
    const prov = new OpenStreetMapProvider()

    const formattedMarkers: LatLngExpression[] = useMemo(() => {
      if (!locations || locations.length === 0) return []
      return locations.map((location) => ({
        lat: location.latitude,
        lng: location.longitude
      }))
    }, [locations])

    useEffect(() => {
      onMarkersUpdate(markers)
    }, [markers, onMarkersUpdate])

    useEffect(() => {
      if (formattedMarkers.length > 0) setMarkers(formattedMarkers)
    }, [formattedMarkers])

    useEffect(() => {
      if (changeMapViewMode && markers && markers.length > 0) {
        setCenterLocation([(markers[0] as LatLng).lat, (markers[0] as LatLng).lng])
      }
    }, [changeMapViewMode, markers])

    const ChangeMapView = ({ coords }: { coords: LatLngExpression }) => {
      const map = useMap()
      map.setView(coords, map.getZoom())
      return null
    }

    const AddMarkerOnClick = () => {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng
          setMarkers([...markers, [lat, lng]])
        }
      })
      return null
    }

    const removeMarker = (pos: LatLng) => {
      const formattedPos = [pos.lat, pos.lng]
      setMarkers((prevCoord) => prevCoord.filter((coord) => JSON.stringify(coord) !== JSON.stringify(formattedPos)))
    }

    const customClusterIcon = (cluster: { getChildCount: () => unknown }) =>
      divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: 'custom-marker-cluster',
        iconSize: point(33, 33, true)
      })

    const customMarkerIcon = (index: number) =>
      divIcon({
        html: `<div class="marker-label">${index + 1}</div>`,
        className: 'custom-marker-label',
        iconSize: [38, 38]
      })

    return (
      <MapContainer center={[16.047079, 108.20623]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapSearchControl
          provider={prov}
          showMarker={false}
          showPopup={false}
          popupFormat={({ result }) => result.label}
          maxMarkers={3}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={false}
          searchLabel={'Enter address'}
          keepResult={true}
        />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={customClusterIcon}>
          {selectMode && <AddMarkerOnClick />}
          {markers.length > 0 &&
            markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker}
                eventHandlers={{
                  click: (e) => {
                    if (removeMode) removeMarker(e.latlng)
                  }
                }}
                icon={customMarkerIcon(index)}
              ></Marker>
            ))}
        </MarkerClusterGroup>
        {changeMapViewMode && <ChangeMapView coords={centerLocation} />}
      </MapContainer>
    )
  },
  (prevProps, nextProps) => prevProps === nextProps
)

Map.displayName = 'Map'
export default Map
