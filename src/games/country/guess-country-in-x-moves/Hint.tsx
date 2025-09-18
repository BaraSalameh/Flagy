import { Modal, Text } from "@/components/ui"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { RootState } from "@/lib/store/store"

export const Hint = () => {
    
    const hint = useAppSelector(state => state.hint);
    const general = useAppSelector(state => state.general);
    const userDidWin = useAppSelector(state => state.country.result);

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ hintText, setHintText ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (general.counter && general.difficulty && hint) {
            setHintText(fillHint(general.difficulty, general.counter, hint));
        }
    }, [general.counter, general.difficulty, hint]);

    useEffect(() => {
        if (!userDidWin) {
            setIsModalOpen(!!hintText);
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hintText]); // ignoring 'userDidWin'

    return (
        <Modal
            subTitle="Hint"
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            isOpenable={false}
            content= {
                <Text>
                    {hintText}
                </Text>
            }
        />
    )
}

const fillHint = (
    difficulty: ReturnType<typeof useAppSelector<RootState['general']['difficulty']>>,
    counter: ReturnType<typeof useAppSelector<RootState['general']['counter']>>,
    hint: ReturnType<typeof useAppSelector<RootState['hint']>>
): string | undefined => {
    switch (difficulty) {
        case 'Beginner':
            return counter === 14
            ?   `Population: ${hint?.population}`
            :   counter === 12
            ?   `Area: ${hint?.area}`
            :   counter === 10
            ?   `Continent: ${hint?.continentName}`
            :   counter === 8
            ?   `Region: ${hint?.region}`
            :   counter === 6
            ?   `Languages: ${hint?.languages}`
            :   counter === 4
            ?   `Neighbors: ${hint?.borders}`
            :   counter === 2 
            ?   `Capital: ${hint?.capital}`
            :   undefined;

        case 'Intermediate':
            return counter === 11
            ?   `Population: ${hint?.population}`
            :   counter === 9
            ?   `Area: ${hint?.area}`
            :   counter === 7
            ?   `Continent: ${hint?.continentName}`
            :   counter === 5
            ?   `Region: ${hint?.region}`
            :   counter === 3
            ?   `Languages: ${hint?.languages}`
            :   counter === 1
            ?   `Capital: ${hint?.capital}`
            :   undefined;
            
        case 'Advanced':
            return counter === 10
            ?   `Population: ${hint?.population}`
            :   counter === 8
            ?   `Area: ${hint?.area}`
            :   counter === 6
            ?   `Continent: ${hint?.continentName}`
            :   counter === 4
            ?   `Region: ${hint?.region}`
            :   counter === 2
            ?   `Languages: ${hint?.languages}`
            :   undefined;
            
        case 'Expert':
            return counter === 7
            ?   `Population: ${hint?.population}`
            :   counter === 5
            ?   `Area: ${hint?.area}`
            :   counter === 3
            ?   `Continent: ${hint?.continentName}`
            :   counter === 1
            ?   `Region: ${hint?.region}`
            :   undefined;
    }
}