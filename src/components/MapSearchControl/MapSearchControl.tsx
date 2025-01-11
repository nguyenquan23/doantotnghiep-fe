/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import './react-leaflet-geosearch.css'

interface MapSearchControlProps {
  provider?: OpenStreetMapProvider
  showMarker?: boolean
  showPopup?: boolean
  popupFormat?: (result: { query: string; result: any }) => string
  maxMarkers?: number
  retainZoomLevel?: boolean
  animateZoom?: boolean
  autoClose?: boolean
  searchLabel?: string
  keepResult?: boolean
}

const MapSearchControl: React.FC<MapSearchControlProps> = ({
  provider,
  showMarker,
  showPopup,
  popupFormat,
  maxMarkers,
  retainZoomLevel,
  animateZoom,
  autoClose,
  searchLabel,
  keepResult
}) => {
  const map = useMap()

  useEffect(() => {
    if (!provider) return

    const searchControl = GeoSearchControl({
      provider,
      showMarker,
      showPopup,
      popupFormat,
      maxMarkers,
      retainZoomLevel,
      animateZoom,
      autoClose,
      searchLabel,
      keepResult,
      notFoundMessage: 'Sorry, that address could not be found.'
    })

    map.addControl(searchControl)

    return () => {
      map.removeControl(searchControl)
    }
  }, [
    map,
    provider,
    showMarker,
    showPopup,
    popupFormat,
    maxMarkers,
    retainZoomLevel,
    animateZoom,
    autoClose,
    searchLabel,
    keepResult
  ])

  return null
}

export default MapSearchControl
