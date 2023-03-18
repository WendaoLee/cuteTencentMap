/**
 * TMap.constants 常量模块。
 * 相关的腾讯地图文档有：
 * - {@link https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap#8}
 */

const MAP_ZOOM_TYPE = {
    CENTER:1,
    DEFAULT:0
}

const LAYER_LEVEL = {
    BASE:1,
    BUILDING:3,
    GROUND:2,
    OVERLAY_AA:4,
    OVERLAY_NAA:7,
    POST_PROCESS:5,
    TEXT:6,
    UNDERGROUND:0
}

const CONTROL_POSITION = {
    BOTTOM_CENTER:7,
    BOTTOM_LEFT:6,
    BOTTOM_RIGHT:8,
    TOP_LEFT:0,
    TOP_CENTER:1,
    TOP_RIGHT:2,
    CENTER_LEFT:3,
    CENTER:4,
    CENTER_RIGHT:5
}

const DEFAULT_CONTROL_ID = {
    FLOOR:"floor",
    ROTATION:"rotation",
    SCALE:"scale",
    ZOOM:"zoom"
}

const GEOMETRY_TYPES = {
    CIRCLE:"CIRCLE",
    ELLIPSE:"ELLIPSE",
    HIGHLIGHT:"HIGHLIGHT",
    LABEL:"LABEL",
    MASK:"MASK",
    POINT:"POINT",
    POLYGON:"POLYGON",
    POLYLINE:"POLYLINE",
    RECTANGLE:"RECTANGLE"
}

const IMAGE_DISPLAY = {
    ORIGIN:0,
    REPEAT:2,
    SCALE:1
}

const LIGHT_TYPE = {
    AMBIENT:"ambient",
    DIRECTION:"dir",
    POINT:"point",
    SPOT:"spot"
}

export const consts = {
    MAP_ZOOM_TYPE:MAP_ZOOM_TYPE,
    LAYER_LEVEL:LAYER_LEVEL,
    CONTROL_POSITION:CONTROL_POSITION,
    DEFAULT_CONTROL_ID:DEFAULT_CONTROL_ID,
    GEOMETRY_TYPES:GEOMETRY_TYPES,
    IMAGE_DISPLAY:IMAGE_DISPLAY,
    LIGHT_TYPE:LIGHT_TYPE
}
