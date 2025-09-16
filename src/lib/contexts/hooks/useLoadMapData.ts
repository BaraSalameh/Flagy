'use client'

import { useContext } from "react";
import { MapContext } from "../MapProvider";

export const useLoadMapData = () => useContext(MapContext).map;