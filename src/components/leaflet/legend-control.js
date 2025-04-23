import L from "leaflet"
import { createControlComponent } from "@react-leaflet/core"
import { getColor } from "../../utils/style"
import { toMln } from "../../utils";


const LegendContainer = L.Control.extend({
    onAdd: function (map) {
        var div = L.DomUtil.create("div", "info legend"),
            grades = [10, 10000, 100000, 500000, 1000000, 20000000, 50000000, 100000000]

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' +
                getColor(grades[i] + 1) +
                '"></i> ' +
                toMln(grades[i], 0) +
                (grades[i + 1] ? "&ndash;" + toMln(grades[i + 1], 0) + "<br>" : "+")
        }

        return div
    },
    onRemove: function (map) { }
});

const LegendControl = createControlComponent(
    (props) => new LegendContainer(props)
);

LegendControl.defaultProps = {
    position: "bottomright"
};

export default LegendControl
