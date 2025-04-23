import "leaflet/dist/leaflet.css"
import { useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

import InfoControl from "../../../components/leaflet/info-control"
import LegendControl from "../../../components/leaflet/legend-control"
import USStatesComponent from "../../../components/leaflet/us-states-component"

export default function StateAverageIndicators({ filters }) {
    const infoRef = useRef()

    return (
        <MapContainer
            center={[37.8, -96]}
            zoom={5}
            maxZoom={7}
            minZoom={4}
            scrollWheelZoom={true}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
            maxBounds={[[-90, -360], [90, 360]]}
        >
            <TileLayer
                attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <InfoControl ref={infoRef} />
            <LegendControl />
            <USStatesComponent infoRef={infoRef} filters={filters} />

        </MapContainer>
    )
}