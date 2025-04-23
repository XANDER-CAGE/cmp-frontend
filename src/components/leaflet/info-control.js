import L from "leaflet"
import { createControlComponent } from "@react-leaflet/core"
import { toMln } from "../../utils"

const InfoContainer = L.Control.extend({
    initialize: function (options) {
        L.Util.setOptions(this, options)
        this.options.properties = options.properties
    },

    onAdd: function (map) {
        this._div = L.DomUtil.create("div", "info") // create a div with a class "info"
        this.update()
        return this._div
    },

    update: function (properties) {
        this._div.innerHTML =
            "<h4>USA</h4>" +
            (properties
                ? "<b>" +
                properties.name +
                "</b><br />" +
                "Discount: " + properties?.discount?.toFixed(2) + "<br />" +
                "Average Discount: " + properties?.avgDiscount?.toFixed(2) + "<br />" +
                "Retail Price: " + properties?.retailPrice?.toFixed(2) + "<br />" +
                "Gallons: " + toMln(properties?.gallons?.toFixed()) + "<br />" +
                "Gross: " + toMln(properties?.gross?.toFixed())
                : "Hover over a state")
    },

    onRemove: function (map) {
        // Nothing to do here
    }
})

const InfoControl = createControlComponent((props) => new InfoContainer(props))

InfoControl.defaultProps = {
    position: "topright",
}

export default InfoControl
