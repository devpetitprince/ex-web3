import { useWeb3React} from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from 'styled-components'
import GreetingArtifact from '../artifacts/contracts/Greeting.sol/Greeting.json'

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const StyledLabel = styled.label`
    font-weight: bold;
`;

export function ContractCall() {
    const { active, library} = useWeb3React()
    const [signer, setSigner] = useState();
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState('');
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library])

    const handleDeployContract = (event) => {
        event.preventDefault();

        if(greetingContract) {
            return;
        }

        async function deployGreetingContract() {
            const Greeting = new ethers.ContractFactory(
             GreetingArtifact.abi,
             GreetingArtifact.bytecode,
             signer
            );

            try{
                const greetingContract = await Greeting.deploy('Hello, Fastcampus');
                await greetingContract.deployed()

                const greeting = await greetingContract.greet();

                setGreetingContract(greetingContract)
                setGreeting(greeting);
                setGreetingContractAddr(greetingContract.address);
                window.alert(`Greeting deployed to : ${greetingContract.address}`)
            } catch (error) {
                window.alert('Error: ', (error && error.message ? `${error.message}`: ''))
            }
        }

        deployGreetingContract()
}

    return (
        <>
         <StyledDeployContractButton disabled = {!active || greetingContract ? true : false} onClick = {handleDeployContract}>Deploy Greeting Contract</StyledDeployContractButton>
         <StyledGreetingDiv>
             <StyledLabel>Contract address</StyledLabel>
             <div> {greetingContractAddr ? greetingContractAddr : 'Contract not yet deployed'}</div>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
             <StyledLabel> Greeting</StyledLabel>
             <div>{greeting ? greeting : <> Contract not yet deployed</> }</div>
             </StyledGreetingDiv>
        </>

    )
}