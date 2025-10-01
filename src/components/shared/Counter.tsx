import { useAppSelector } from "@/lib/store/hooks"
import { NavButton } from "../ui";
import { Clock } from "lucide-react";

export const Counter = () => {
    const counter = useAppSelector(state => state.general.counter);

    return(
        <div className="absolute top-[50%] translate-y-[-50%] left-[5%] flex items-center">
            <NavButton
                label={`${counter}`}
                hoverable={false}
                icon={Clock}
                onClick={() => {}}
            />
        </div>
    )
}