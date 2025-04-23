import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { getColor } from "../../utils/style";
import { statesData } from "../../sources/states-data";
import http from "../../utils/axiosInterceptors";

const USStatesComponent = ({ infoRef, filters }) => {
    const map = useMap();
    const geojsonRef = useRef();

    let data = statesData

    const getDashboardInfo = async () => {
        try {
            const response = await http.post(`dashboard/Chart/StateAverageIndicators`, filters)
            response?.data?.forEach((item) => {
                data.features.forEach((s) => {
                    if (item.state === s.id) {
                        s.properties.avgDiscount = item.avgDiscount
                        s.properties.discount = item.discount
                        s.properties.gallons = item.gallons
                        s.properties.retailPrice = item.retailPrice
                        s.properties.gross = item.gross
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.gross),
        };
    }

    useEffect(() => {
        getDashboardInfo()

        // eslint-disable-next-line
    }, [filters])

    // Mouseover function
    const highlightFeature = (e) => {
        var layer = e.target;

        // style(layer)

        layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        infoRef.current.update(layer.feature.properties);
    };

    // Define function for `mouseout`
    const resetHighlight = (e) => {
        geojsonRef.current.resetStyle(e.target);
        infoRef.current.update(null);
    };

    const zoomToFeature = (e) => {
        map.fitBounds(e.target.getBounds());
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    };

    return (
        <GeoJSON
            data={data}
            style={style}
            onEachFeature={onEachFeature}
            ref={geojsonRef}
        />
    );
};

export default USStatesComponent;
