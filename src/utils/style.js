export function getColor(d) {
    return d > 100000000
        ? "#800026"
        : d > 50000000
            ? "#BD0026"
            : d > 20000000
                ? "#E31A1C"
                : d > 1000000
                    ? "#FC4E2A"
                    : d > 500000
                        ? "#FD8D3C"
                        : d > 100000
                            ? "#FEB24C"
                            : d > 10000
                                ? "#FED976"
                                : "#FFEDA0";
}

// functions for styling
export function style(feature) {
    return {
        fillColor: getColor(feature.properties.avgDiscount),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7
    };
}
