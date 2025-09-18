import { useAppSelector } from "@/lib/store/hooks"
import { NavButton } from "../ui";
import { Clock } from "lucide-react";

export const Counter = () => {
    const counter = useAppSelector(state => state.general.counter);

    return(
        <NavButton
            label={`${counter}`}
            hoverable={false}
            icon={Clock}
            onClick={() => {}}
        />
    )
}