import { Modal, Text } from "@/components/ui"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { RootState } from "@/lib/store/store"
import { setHintMessage } from "@/lib/store/slices/geoGuessSlice"

export const Hint = () => {
    const dispatch = useAppDispatch();
    const generalState = useAppSelector(state => state.general);
    const counter = generalState.counter;
    const difficulty = generalState.difficulty;
    const result = generalState.result;

    const geoGuessState = useAppSelector(state => state.geoGuess);
    const hintInformation = geoGuessState.hint?.information;
    const hintMessage = geoGuessState.hint?.message;

    const [ isModalOpen, setIsModalOpen ] = useState(false);

    useEffect(() => {
        if (counter && difficulty && hintInformation && !result) {
            dispatch(setHintMessage(fillHint(difficulty, counter, hintInformation)));
        }
    }, [counter, difficulty, hintInformation, result, dispatch]);

    useEffect(() => {
        setIsModalOpen(!!hintMessage);
    }, [hintMessage]);

    return (
        <Modal
            subTitle="Hint: Random country"
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            isOpenable={false}
            content= {
                <Text>
                    {hintMessage}
                </Text>
            }
        />
    )
}

const fillHint = (
    difficulty: ReturnType<typeof useAppSelector<RootState['general']['difficulty']>>,
    counter: ReturnType<typeof useAppSelector<RootState['general']['counter']>>,
    hintInformation: ReturnType<typeof useAppSelector<RootState['geoGuess']['hint']['information']>>
): string | string[] | undefined => {
    const population = Number(hintInformation.population).toLocaleString("en-US", {notation: "compact"});
    const area = hintInformation.area.toLocaleString("en-US") + " km²";
    const languages: string | string[] = hintInformation.languages.length === 0 ? "A country with no specific language" : hintInformation.languages;
    const neighbors: string | string[] = hintInformation.borders.length === 0 ? "A country with no borders" : hintInformation.borders;

    switch (difficulty) {
        case 'Beginner':
            return counter === 15
            ?   `Population: ${population}`
            :   counter === 13
            ?   `Area: ${area}`
            :   counter === 11
            ?   `Continent: ${hintInformation.continentName}`
            :   counter === 9
            ?   `Region: ${hintInformation.region}`
            :   counter === 7
            ?   `Languages: ${languages}`
            :   counter === 5
            ?   `Neighbors: ${neighbors}`
            :   counter === 3 
            ?   `Capital: ${hintInformation.capital}`
            :   undefined;

        case 'Intermediate':
            return counter === 12
            ?   `Population: ${population}`
            :   counter === 10
            ?   `Area: ${area}`
            :   counter === 8
            ?   `Continent: ${hintInformation.continentName}`
            :   counter === 6
            ?   `Region: ${hintInformation.region}`
            :   counter === 4
            ?   `Languages: ${languages}`
            :   counter === 2
            ?   `Capital: ${hintInformation.capital}`
            :   undefined;
            
        case 'Advanced':
            return counter === 10
            ?   `Population: ${population}`
            :   counter === 8
            ?   `Area: ${area}`
            :   counter === 6
            ?   `Continent: ${hintInformation.continentName}`
            :   counter === 4
            ?   `Region: ${hintInformation.region}`
            :   counter === 2
            ?   `Languages: ${languages}`
            :   undefined;
            
        case 'Expert':
            return counter === 7
            ?   `Population: ${population}`
            :   counter === 5
            ?   `Area: ${area}`
            :   counter === 3
            ?   `Continent: ${hintInformation.continentName}`
            :   counter === 1
            ?   `Region: ${hintInformation.region}`
            :   undefined;
    }
}