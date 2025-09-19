import { Modal, Text } from "@/components/ui"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { RootState } from "@/lib/store/store"
import { setHint } from "@/lib/store/slices/hintSlice"

export const Hint = () => {
    const dispatch = useAppDispatch();
    const general = useAppSelector(state => state.general);
    const hintState = useAppSelector(state => state.hint);
    const userDidWin = useAppSelector(state => state.country.result);

    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const counter = general.counter;
    const difficulty = general.difficulty;
    const information = hintState.information;
    const hint = hintState.hint;

    useEffect(() => {
        if (counter && difficulty && information && !userDidWin) {
            dispatch(setHint(fillHint(difficulty, counter, information)));
        }
    }, [counter, difficulty, information, userDidWin, dispatch]);

    useEffect(() => {
        setIsModalOpen(!!hint);
    }, [hint]);

    return (
        <Modal
            subTitle="Hint"
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            isOpenable={false}
            content= {
                <Text>
                    {hint}
                </Text>
            }
        />
    )
}

const fillHint = (
    difficulty: ReturnType<typeof useAppSelector<RootState['general']['difficulty']>>,
    counter: ReturnType<typeof useAppSelector<RootState['general']['counter']>>,
    information: ReturnType<typeof useAppSelector<RootState['hint']['information']>>
): string | string[] | undefined => {
    const population = Number(information.population).toLocaleString("en-US", {notation: "compact"});
    const area = information.area.toLocaleString("en-US") + " km²";
    const languages: string | string[] = information.languages.length === 0 ? "A country with no specific language" : information.languages;
    const neighbors: string | string[] = information.borders.length === 0 ? "A country with no borders" : information.borders;

    switch (difficulty) {
        case 'Beginner':
            return counter === 14
            ?   `Population: ${population}`
            :   counter === 12
            ?   `Area: ${area}`
            :   counter === 10
            ?   `Continent: ${information.continentName}`
            :   counter === 8
            ?   `Region: ${information.region}`
            :   counter === 6
            ?   `Languages: ${languages}`
            :   counter === 4
            ?   `Neighbors: ${neighbors}`
            :   counter === 2 
            ?   `Capital: ${information.capital}`
            :   undefined;

        case 'Intermediate':
            return counter === 11
            ?   `Population: ${information.population}`
            :   counter === 9
            ?   `Area: ${area}`
            :   counter === 7
            ?   `Continent: ${information.continentName}`
            :   counter === 5
            ?   `Region: ${information.region}`
            :   counter === 3
            ?   `Languages: ${languages}`
            :   counter === 1
            ?   `Capital: ${information.capital}`
            :   undefined;
            
        case 'Advanced':
            return counter === 10
            ?   `Population: ${information.population}`
            :   counter === 8
            ?   `Area: ${area}`
            :   counter === 6
            ?   `Continent: ${information.continentName}`
            :   counter === 4
            ?   `Region: ${information.region}`
            :   counter === 2
            ?   `Languages: ${languages}`
            :   undefined;
            
        case 'Expert':
            return counter === 7
            ?   `Population: ${population}`
            :   counter === 5
            ?   `Area: ${area}`
            :   counter === 3
            ?   `Continent: ${information.continentName}`
            :   counter === 1
            ?   `Region: ${information.region}`
            :   undefined;
    }
}