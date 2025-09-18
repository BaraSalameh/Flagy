import { Modal, Text } from "@/components/ui"
import { useGetDifficulty } from "@/lib/contexts/hooks"
import { InfoData } from "@/lib/contexts/types.context"
import { useEffect, useState } from "react"
import { GameDifficulty } from "@/components/shared/types.shared"

export const Hint = ({ hint, counter }: { hint: InfoData | undefined; counter: number | undefined }) => {
    
    const difficulty = useGetDifficulty();

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ hintText, setHintText ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (counter && difficulty) {
            setHintText(fillHint(counter, difficulty, hint));
        }
    }, [counter, difficulty]);

    useEffect(() => {
        setIsModalOpen(hintText ? true : false);
    }, [hintText]);

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

const fillHint = (counter: number, difficulty: GameDifficulty, hint: InfoData | undefined): string | undefined => {
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