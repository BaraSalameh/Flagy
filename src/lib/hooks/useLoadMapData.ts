'use client'

import { useContext } from "react";
import { MapContext } from "../contexts/MapContext";

export const useLoadMapData = () => useContext(MapContext).map;