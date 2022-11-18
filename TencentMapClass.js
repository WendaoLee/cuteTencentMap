export const TMap= {
    constants:{
        MAP_ZOOM_TYPE:{
            DEFAULT:0,
            CENTER:1
        }
    }
}

export const ConstructMapping = {

}

export function TMap_LatLng(lat,lng){
    return new window.TMap.LatLng(lat,lng)
}

export function TMap_LatLngBounds({
    sw={
        lat:30.412919,
        lng:111.75407
    },
    ne={
        lat:30.50000,
        lng:111.75430
    }
}){
    return new window.TMap.LatLngBounds(
        TMap_LatLng(sw.lat,sw.lng),
        TMap_LatLng(ne.lat,ne.lng)
    )
}

